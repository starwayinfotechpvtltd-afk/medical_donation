// app/admin/inquiries/page.tsx
'use client';

import { useState } from "react";
import {
  MessageSquare, Search, Filter, MoreHorizontal, Eye, 
  CheckCircle2, XCircle, Clock, Reply, Trash2, Star,
  User, Mail, Phone, Calendar, Download,
  Printer, AlertCircle, Flag, Paperclip, Send, X,
  ChevronLeft, ChevronRight, Archive, RefreshCw,
  FileText
} from "lucide-react";

// Types
type InquiryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';
type InquiryPriority = 'low' | 'medium' | 'high' | 'urgent';
type InquiryCategory = 'general' | 'appointment' | 'billing' | 'medical' | 'feedback' | 'complaint';

interface Inquiry {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  subject: string;
  message: string;
  category: InquiryCategory;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  attachments?: string[];
  replies?: InquiryReply[];
  tags?: string[];
}

interface InquiryReply {
  id: string;
  message: string;
  repliedBy: string;
  repliedAt: string;
  isStaff: boolean;
}

// Mock Data
const mockInquiries: Inquiry[] = [
  {
    id: "1",
    patientName: "John Sharma",
    patientEmail: "john.sharma@email.com",
    patientPhone: "+91 98765 43210",
    subject: "Unable to book appointment online",
    message: "I've been trying to book an appointment with Dr. Rajesh Kumar for the past two days but the online portal keeps showing an error. Please help me schedule an appointment.",
    category: "appointment",
    status: "new",
    priority: "high",
    createdAt: "2024-03-27T09:30:00",
    updatedAt: "2024-03-27T09:30:00",
    tags: ["technical", "urgent"]
  },
  {
    id: "2",
    patientName: "Priya Patel",
    patientEmail: "priya.patel@email.com",
    patientPhone: "+91 98765 43211",
    subject: "Billing discrepancy in recent visit",
    message: "I visited the hospital on March 20th for a consultation and was charged ₹1500, but my insurance should have covered 80% of this. Please review the billing statement.",
    category: "billing",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-03-26T14:15:00",
    updatedAt: "2024-03-27T10:00:00",
    assignedTo: "Billing Team",
    tags: ["billing", "insurance"]
  },
  {
    id: "3",
    patientName: "Aisha Khan",
    patientEmail: "aisha.khan@email.com",
    patientPhone: "+91 98765 43212",
    subject: "Appreciation for Dr. Priya Singh",
    message: "I would like to express my gratitude to Dr. Priya Singh and her team for the excellent care provided during my mother's treatment. The staff was very supportive and professional.",
    category: "feedback",
    status: "resolved",
    priority: "low",
    createdAt: "2024-03-25T11:20:00",
    updatedAt: "2024-03-26T09:45:00",
    assignedTo: "Patient Relations",
    tags: ["appreciation", "feedback"]
  },
  {
    id: "4",
    patientName: "Ravi Patel",
    patientEmail: "ravi.patel@email.com",
    patientPhone: "+91 98765 43213",
    subject: "Request for medical records",
    message: "I need copies of my medical records from my last admission (January 2024) for insurance purposes. Please let me know the procedure to obtain these documents.",
    category: "medical",
    status: "new",
    priority: "medium",
    createdAt: "2024-03-27T08:45:00",
    updatedAt: "2024-03-27T08:45:00",
    tags: ["records", "documentation"]
  },
  {
    id: "5",
    patientName: "Sara Ahmed",
    patientEmail: "sara.ahmed@email.com",
    patientPhone: "+91 98765 43214",
    subject: "Complaint about long waiting time",
    message: "I had an appointment at 10 AM today but was only seen at 11:30 AM. This is unacceptable and I would like to understand why there was such a long delay.",
    category: "complaint",
    status: "in-progress",
    priority: "high",
    createdAt: "2024-03-27T12:00:00",
    updatedAt: "2024-03-27T13:30:00",
    assignedTo: "Patient Relations",
    tags: ["waiting-time", "complaint"]
  },
  {
    id: "6",
    patientName: "Arun Mehta",
    patientEmail: "arun.mehta@email.com",
    patientPhone: "+91 98765 43215",
    subject: "General inquiry about services",
    message: "I would like to know more about the physiotherapy services offered at your hospital. Do you offer home visits? What are the charges?",
    category: "general",
    status: "new",
    priority: "low",
    createdAt: "2024-03-26T16:30:00",
    updatedAt: "2024-03-26T16:30:00",
    tags: ["physiotherapy", "services"]
  }
];

// Status Badge Component
function StatusBadge({ status }: { status: InquiryStatus }) {
  const config = {
    'new': { icon: AlertCircle, color: "bg-red-50 text-red-700", label: "New" },
    'in-progress': { icon: Clock, color: "bg-amber-50 text-amber-700", label: "In Progress" },
    'resolved': { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700", label: "Resolved" },
    'closed': { icon: XCircle, color: "bg-slate-50 text-slate-700", label: "Closed" }
  };
  const { icon: Icon, color, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: InquiryPriority }) {
  const config = {
    'low': { color: "bg-slate-100 text-slate-600", label: "Low" },
    'medium': { color: "bg-blue-100 text-blue-700", label: "Medium" },
    'high': { color: "bg-amber-100 text-amber-700", label: "High" },
    'urgent': { color: "bg-red-100 text-red-700", label: "Urgent" }
  };
  const { color, label } = config[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function CategoryBadge({ category }: { category: InquiryCategory }) {
  const config = {
    'general': { icon: MessageSquare, color: "bg-slate-100 text-slate-600", label: "General" },
    'appointment': { icon: Calendar, color: "bg-blue-100 text-blue-700", label: "Appointment" },
    'billing': { icon: AlertCircle, color: "bg-amber-100 text-amber-700", label: "Billing" },
    'medical': { icon: FileText, color: "bg-emerald-100 text-emerald-700", label: "Medical" },
    'feedback': { icon: Star, color: "bg-purple-100 text-purple-700", label: "Feedback" },
    'complaint': { icon: Flag, color: "bg-red-100 text-red-700", label: "Complaint" }
  };
  const { icon: Icon, color, label } = config[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Inquiry Card Component
function InquiryCard({ 
  inquiry, 
  onView, 
  onReply,
  onStatusChange 
}: { 
  inquiry: Inquiry; 
  onView: (inquiry: Inquiry) => void; 
  onReply: (inquiry: Inquiry) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}) {
  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {inquiry.patientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 truncate">{inquiry.patientName}</h3>
              <CategoryBadge category={inquiry.category} />
              <PriorityBadge priority={inquiry.priority} />
            </div>
            <p className="text-sm text-slate-600 truncate mt-0.5">{inquiry.subject}</p>
          </div>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>
      
      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{inquiry.message}</p>
      
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{inquiry.patientEmail}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{inquiry.patientPhone}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{getTimeAgo(inquiry.createdAt)}</span>
        </div>
      </div>
      
      {inquiry.tags && inquiry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {inquiry.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onView(inquiry)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={() => onReply(inquiry)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-600 transition-colors"
        >
          <Reply className="w-3.5 h-3.5" />
          Reply
        </button>
        <select
          value={inquiry.status}
          onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
          className="px-2 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 border-0 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
}

// Inquiry Detail Modal
function InquiryDetailModal({ 
  inquiry, 
  isOpen, 
  onClose,
  onReply,
  onStatusChange
}: { 
  inquiry: Inquiry | null; 
  isOpen: boolean; 
  onClose: () => void;
  onReply: (inquiry: Inquiry) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}) {
  const [replyText, setReplyText] = useState("");
  
  if (!isOpen || !inquiry) return null;
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Inquiry Details</h2>
            <StatusBadge status={inquiry.status} />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{inquiry.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{inquiry.patientEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{inquiry.patientPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Submitted: {formatDate(inquiry.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Inquiry Content */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Subject</h3>
              <CategoryBadge category={inquiry.category} />
              <PriorityBadge priority={inquiry.priority} />
            </div>
            <p className="text-base font-medium text-slate-900 mb-3">{inquiry.subject}</p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{inquiry.message}</p>
          </div>
          
          {/* Tags */}
          {inquiry.tags && inquiry.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {inquiry.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Status Update */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Update Status</h3>
            <div className="flex gap-2">
              {(['new', 'in-progress', 'resolved', 'closed'] as InquiryStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => onStatusChange(inquiry.id, status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    inquiry.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'new' ? 'New' : status === 'in-progress' ? 'In Progress' : status === 'resolved' ? 'Resolved' : 'Closed'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Reply Section */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Reply to Patient</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Type your reply here..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onReply({ ...inquiry, replies: [...(inquiry.replies || []), {
                      id: Date.now().toString(),
                      message: replyText,
                      repliedBy: "Admin",
                      repliedAt: new Date().toISOString(),
                      isStaff: true
                    }]});
                    setReplyText("");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reply Modal
function ReplyModal({ 
  inquiry, 
  isOpen, 
  onClose,
  onSendReply
}: { 
  inquiry: Inquiry | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSendReply: (inquiryId: string, reply: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  
  if (!isOpen || !inquiry) return null;
  
  const handleSend = () => {
    if (replyText.trim()) {
      onSendReply(inquiry.id, replyText);
      setReplyText("");
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Reply to Inquiry</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-500 mb-1">From: {inquiry.patientName}</p>
            <p className="text-sm text-slate-500 mb-1">Subject: {inquiry.subject}</p>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{inquiry.message}</p>
          </div>
          
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Reply
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            placeholder="Type your reply here..."
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            autoFocus
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSend}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Send Reply
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyInquiry, setReplyInquiry] = useState<Inquiry | null>(null);

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || inquiry.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || inquiry.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === "new").length,
    inProgress: inquiries.filter(i => i.status === "in-progress").length,
    resolved: inquiries.filter(i => i.status === "resolved").length,
    highPriority: inquiries.filter(i => i.priority === "high" || i.priority === "urgent").length,
  };

  const handleStatusChange = (id: string, newStatus: InquiryStatus) => {
    setInquiries(inquiries.map(i => 
      i.id === id ? { ...i, status: newStatus, updatedAt: new Date().toISOString() } : i
    ));
  };

  const handleSendReply = (inquiryId: string, replyMessage: string) => {
    setInquiries(inquiries.map(i => 
      i.id === inquiryId ? {
        ...i,
        replies: [...(i.replies || []), {
          id: Date.now().toString(),
          message: replyMessage,
          repliedBy: "Admin",
          repliedAt: new Date().toISOString(),
          isStaff: true
        }],
        updatedAt: new Date().toISOString(),
        status: i.status === "new" ? "in-progress" : i.status
      } : i
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
            <p className="text-sm text-slate-500 mt-1">Manage patient inquiries, feedback, and support tickets</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white rounded-lg transition-colors border border-slate-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-sm text-slate-500">Total Inquiries</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.new}</span>
            </div>
            <p className="text-sm text-slate-500">New</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
            </div>
            <p className="text-sm text-slate-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.resolved}</span>
            </div>
            <p className="text-sm text-slate-500">Resolved</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Flag className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-slate-900">{stats.highPriority}</span>
            </div>
            <p className="text-sm text-slate-500">High Priority</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name, subject, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Categories</option>
              <option value="general">General</option>
              <option value="appointment">Appointment</option>
              <option value="billing">Billing</option>
              <option value="medical">Medical</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Inquiries Grid */}
        {filteredInquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onView={(inq) => {
                  setSelectedInquiry(inq);
                  setShowDetailModal(true);
                }}
                onReply={(inq) => {
                  setReplyInquiry(inq);
                  setShowReplyModal(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg font-medium">No inquiries found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedInquiry(null);
        }}
        onReply={(inq) => {
          setReplyInquiry(inq);
          setShowReplyModal(true);
          setShowDetailModal(false);
        }}
        onStatusChange={handleStatusChange}
      />
      
      <ReplyModal
        inquiry={replyInquiry}
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setReplyInquiry(null);
        }}
        onSendReply={handleSendReply}
      />
    </div>
  );
}