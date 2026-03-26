'use client';

import { useState } from 'react';
import { X, Heart, Check, AlertCircle } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const donationOptions = [
    { amount: 500, title: 'Supporter', description: 'Basic Health Check' },
    { amount: 1000, title: 'Contributor', description: 'One Month Supplies' },
    { amount: 5000, title: 'Benefactor', description: 'Advanced Diagnosis' },
    { amount: 10000, title: 'Philanthropist', description: 'Full Hospital Support' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount && !customAmount) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setDonorName('');
      setDonorEmail('');
      setMessage('');
    }, 2000);
  };

  if (!isOpen) return null;

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-sky-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Make a Donation</h2>
              <p className="text-blue-100 text-sm">Support Quality Healthcare</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Donation Impact Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Your Impact</h3>
                    <p className="text-slate-600 text-sm">Every contribution directly supports healthcare services for patients in need. Your donation is 100% utilized for medical care.</p>
                  </div>
                </div>
              </div>

              {/* Preset Donation Amounts */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-4">Select Donation Amount</label>
                <div className="grid grid-cols-2 gap-4">
                  {donationOptions.map((option) => (
                    <button
                      key={option.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(option.amount);
                        setCustomAmount('');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                        selectedAmount === option.amount
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105'
                          : 'bg-white text-slate-900 border-blue-200 hover:border-blue-400'
                      }`}
                    >
                      <p className="text-lg">₹{option.amount.toLocaleString()}</p>
                      <p className="text-xs opacity-75 mt-1">{option.title}</p>
                      <p className="text-xs opacity-60">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Or Enter Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">Donor Information</label>
                
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />

                <textarea
                  placeholder="Add a message (Optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!finalAmount}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  finalAmount
                    ? 'bg-gradient-to-r from-blue-500 to-sky-500 hover:shadow-lg scale-100'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Heart className="w-5 h-5" />
                Donate ₹{finalAmount.toLocaleString()}
              </button>

              <p className="text-center text-xs text-slate-500">
                Your donation is secure and encrypted. We process donations with 100% transparency.
              </p>
            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-600 mb-4">
                Your donation of <span className="font-bold">₹{finalAmount.toLocaleString()}</span> has been received
              </p>
              <p className="text-slate-500 text-sm">
                A confirmation email will be sent to {donorEmail || 'your email'}
              </p>
              <p className="text-slate-400 text-xs mt-6">
                Your contribution will help us provide better healthcare services to those in need.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
