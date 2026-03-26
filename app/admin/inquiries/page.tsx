"use client";

import { useState } from "react";
import { mockInquiries, type Inquiry } from "@/data/inquiries";
import { Mail, Phone, MessageSquare } from "lucide-react";

export default function AdminInquiries() {
  const [inquiries] = useState<Inquiry[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  return (
    <main className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Contact Inquiries</h1>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-slate-900">{inquiries.length}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Recent (Last 7 days)</p>
                  <p className="text-3xl font-bold text-slate-900">{inquiries.length}</p>
                </div>
                <Mail className="w-12 h-12 text-emerald-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Response Rate</p>
                  <p className="text-3xl font-bold text-slate-900">100%</p>
                </div>
                <Phone className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="grid md:grid-cols-2 gap-6">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{inquiry.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm mb-2">{inquiry.subject}</p>
                  <p className="text-slate-600 text-sm line-clamp-2">{inquiry.message}</p>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{inquiry.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{inquiry.phone}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Received: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {inquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No inquiries found.</p>
            </div>
          )}
        </div>

        {/* Modal for viewing full inquiry */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedInquiry.subject}</h2>
              <p className="text-slate-600 text-lg mb-6">{selectedInquiry.name}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Email</p>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-emerald-600 hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Phone</p>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-emerald-600 hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Message</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed">{selectedInquiry.message}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
