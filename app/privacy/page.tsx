// app/privacy/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Heart,
  Lock,
  Eye,
  Database,
  Server,
  Cookie,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Download,
  Printer,
  Home,
  Globe,
  Smartphone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  const [lastUpdated] = useState("April 30, 2024");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "information", title: "Information We Collect", icon: Database },
    { id: "usage", title: "How We Use Your Information", icon: Eye },
    { id: "sharing", title: "Information Sharing", icon: UserCheck },
    { id: "security", title: "Data Security", icon: Shield },
    { id: "retention", title: "Data Retention", icon: Clock },
    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
    { id: "rights", title: "Your Privacy Rights", icon: FileText },
    { id: "children", title: "Children's Privacy", icon: Heart },
    { id: "third-party", title: "Third-Party Services", icon: Globe },
    { id: "changes", title: "Changes to Policy", icon: AlertCircle },
    { id: "contact", title: "Contact Us", icon: Mail },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-emerald-100 text-lg max-w-2xl">
              Your privacy is important to us. Learn how we collect, use, and
              protect your personal and health information.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-emerald-200">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                  <h2 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    On this page
                  </h2>
                </div>
                <nav className="p-3 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        <span className="flex-1">{section.title}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Introduction */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <p className="text-slate-600 leading-relaxed">
                  At Mefigure Siddhi Vadanta Foundation ("we," "us," "our"), we
                  are committed to protecting your privacy and the
                  confidentiality of your personal and health information. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you use our website, mobile
                  application, and related services.
                </p>
              </div>

              {/* Information We Collect */}
              <section
                id="information"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Database className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      1. Information We Collect
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    We collect various types of information to provide and
                    improve our services:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        Personal Information
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                        <li>Name, date of birth, and contact details</li>
                        <li>Government-issued identification</li>
                        <li>Emergency contact information</li>
                        <li>Insurance and billing information</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-emerald-600" />
                        Health Information
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                        <li>Medical history and conditions</li>
                        <li>Lab results and diagnostic reports</li>
                        <li>Prescriptions and medications</li>
                        <li>Treatment plans and progress notes</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        Technical Information
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Usage patterns and preferences</li>
                        <li>Location data (with consent)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        Communication Data
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                        <li>Messages and inquiries</li>
                        <li>Feedback and survey responses</li>
                        <li>Appointment notes</li>
                        <li>Telemedicine recordings (with consent)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section
                id="usage"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      2. How We Use Your Information
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>We use your information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, maintain, and improve healthcare services</li>
                    <li>Schedule and manage appointments</li>
                    <li>Process prescriptions and lab orders</li>
                    <li>Communicate with you about your health</li>
                    <li>Bill for services and process insurance claims</li>
                    <li>Comply with legal and regulatory requirements</li>
                    <li>
                      Conduct research and quality improvement (de-identified
                      data)
                    </li>
                    <li>Send appointment reminders and health notifications</li>
                  </ul>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 mt-4">
                    <p className="text-sm text-emerald-800 flex items-start gap-2">
                      <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        We will never sell your personal or health information
                        to third parties for marketing purposes without your
                        explicit consent.
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section
                id="sharing"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      3. Information Sharing
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>We may share your information with:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Healthcare Providers:</strong> Doctors, nurses,
                      and specialists involved in your care
                    </li>
                    <li>
                      <strong>Laboratories:</strong> For processing tests and
                      results
                    </li>
                    <li>
                      <strong>Pharmacies:</strong> For prescription fulfillment
                    </li>
                    <li>
                      <strong>Insurance Companies:</strong> For billing and
                      claims processing
                    </li>
                    <li>
                      <strong>Business Associates:</strong> Vendors who help us
                      operate (with confidentiality agreements)
                    </li>
                    <li>
                      <strong>Legal Authorities:</strong> When required by law
                      or to protect safety
                    </li>
                  </ul>
                  <p>
                    We require all third parties to maintain the confidentiality
                    and security of your information and to use it only for
                    authorized purposes.
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section
                id="security"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      4. Data Security
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    We implement comprehensive security measures to protect your
                    information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-700">
                        256-bit Encryption
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        All data encrypted in transit and at rest
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <Server className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-700">
                        Secure Servers
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Housed in ISO 27001 certified facilities
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <Eye className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-700">
                        Access Controls
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Role-based access and audit trails
                      </p>
                    </div>
                  </div>
                  <p className="mt-4">
                    Despite our best efforts, no security system is
                    impenetrable. We cannot guarantee the absolute security of
                    your information and encourage you to take steps to protect
                    your account credentials.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section
                id="retention"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      5. Data Retention
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    We retain your information as long as necessary to provide
                    services and comply with legal obligations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Medical Records:</strong> Retained for minimum
                      period required by law (typically 7-10 years)
                    </li>
                    <li>
                      <strong>Account Information:</strong> Retained until you
                      request deletion
                    </li>
                    <li>
                      <strong>Communication Logs:</strong> Retained for 3 years
                    </li>
                    <li>
                      <strong>Billing Records:</strong> Retained for 7 years for
                      tax/audit purposes
                    </li>
                  </ul>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        You may request deletion of your data at any time.
                        However, certain information may be retained for legal
                        or medical record-keeping requirements.
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies & Tracking */}
              <section
                id="cookies"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      6. Cookies & Tracking
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    We use cookies and similar technologies to enhance your
                    experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Essential Cookies:</strong> Required for platform
                      functionality
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand
                      usage patterns
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your
                      settings
                    </li>
                    <li>
                      <strong>Session Cookies:</strong> Maintain your login
                      session
                    </li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser.
                    However, disabling cookies may affect platform
                    functionality.
                  </p>
                </div>
              </section>

              {/* Your Privacy Rights */}
              <section
                id="rights"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      7. Your Privacy Rights
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>Depending on your location, you may have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal and health information</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Object to certain data processing activities</li>
                    <li>Receive a copy of your data in portable format</li>
                    <li>Withdraw consent for specific uses</li>
                    <li>Lodge a complaint with regulatory authorities</li>
                  </ul>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        To exercise your rights, please contact our Privacy
                        Officer at
                        <strong> mefigureceleb@gmail.com</strong> or call{" "}
                        <strong>+91 8899700966</strong>.
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Children's Privacy */}
              <section
                id="children"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      8. Children's Privacy
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    Our services are not directed to children under 13. We do
                    not knowingly collect personal information from children
                    under 13. If you believe a child has provided us with
                    information, please contact us immediately.
                  </p>
                  <p>
                    For minors (13-18), we require parental or guardian consent
                    before collecting health information. Parents/guardians have
                    full access to their child's records and may request
                    corrections or deletion.
                  </p>
                </div>
              </section>

              {/* Third-Party Services */}
              <section
                id="third-party"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      9. Third-Party Services
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    Our platform may link to third-party websites or services.
                    We are not responsible for the privacy practices of these
                    third parties. We encourage you to review their privacy
                    policies before providing any information.
                  </p>
                  <p>Third-party services we may integrate with include:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payment processors (secure, PCI-compliant)</li>
                    <li>Laboratory information systems</li>
                    <li>Pharmacy management systems</li>
                    <li>Insurance verification services</li>
                    <li>Analytics providers (de-identified data only)</li>
                  </ul>
                </div>
              </section>

              {/* Changes to Policy */}
              <section
                id="changes"
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      10. Changes to This Policy
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4 text-slate-600">
                  <p>
                    We may update this Privacy Policy periodically to reflect
                    changes in our practices or legal requirements. When we
                    update the policy, we will:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Post the revised policy on this page</li>
                    <li>Update the "Last Updated" date</li>
                    <li>Notify users via email of significant changes</li>
                    <li>Obtain renewed consent if required by law</li>
                  </ul>
                  <p>
                    We encourage you to review this policy regularly. Your
                    continued use of our services after changes constitutes
                    acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section
                id="contact"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl overflow-hidden scroll-mt-20"
              >
                <div className="p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">11. Contact Us</h2>
                  </div>
                  <p className="text-emerald-100 mb-6">
                    If you have questions about this Privacy Policy or our
                    privacy practices, please contact our Privacy Officer:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-semibold mb-2">Email</p>
                      <p className="text-sm text-emerald-100">
                        mefigureceleb@gmail.com
                      </p>
                      {/* <p className="text-sm text-emerald-100 mt-1">
                        mefigureceleb@gmail.com
                      </p> */}
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-semibold mb-2">Phone</p>
                      <p className="text-sm text-emerald-100">
                        +91 8899700966 (Privacy Office)
                      </p>
                      {/* <p className="text-sm text-emerald-100 mt-1">
                        +91 8899700966 (Data Protection)
                      </p> */}
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-semibold mb-2">Address</p>
                      <p className="text-sm text-emerald-100">
                        Mefigure Siddhi Vadanta
                        <br />
                        H NO 32, VILLAGE GARHI NAWABAD, Grahi Noabad
                        <br />
                        Budhana, Muzaffarnagar- 251309
                        <br />
                        Uttar Pradesh, India
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-semibold mb-2">Hours</p>
                      <p className="text-sm text-emerald-100">
                        Monday - Friday: 9:00 AM - 6:00 PM IST
                      </p>
                      <p className="text-sm text-emerald-100 mt-1">
                        Saturday: 10:00 AM - 2:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
