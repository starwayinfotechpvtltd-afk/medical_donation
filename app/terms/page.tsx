// app/terms/page.tsx (Updated with Registration and Tax Information)

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Heart, FileText, CheckCircle, AlertCircle,
  Users, Calendar, Pill, Stethoscope, Activity,
  Lock, Eye, Database, Clock, Phone, Mail,
  ChevronRight, Home, Printer, Download,
  Building2, Award, FileCheck, BadgeIndianRupee
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsConditions() {
const [lastUpdated] = useState(
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'services', title: 'Medical Services', icon: Stethoscope },
    { id: 'appointments', title: 'Appointments & Cancellations', icon: Calendar },
    { id: 'prescriptions', title: 'Prescriptions & Medications', icon: Pill },
    { id: 'lab-reports', title: 'Lab Reports & Results', icon: Activity },
    { id: 'privacy', title: 'Privacy & Data Protection', icon: Lock },
    { id: 'telemedicine', title: 'Telemedicine Services', icon: Heart },
    { id: 'user-responsibilities', title: 'User Responsibilities', icon: Users },
    { id: 'limitations', title: 'Limitations of Liability', icon: AlertCircle },
    { id: 'amendments', title: 'Amendments to Terms', icon: FileText },
    { id: 'legal', title: 'Legal & Tax Information', icon: Building2 },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Please read these terms carefully before using our healthcare services. 
            By accessing our platform, you agree to be bound by these terms.
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

            {/* Registration Info Card */}
            <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 overflow-hidden">
              <div className="p-4 bg-emerald-600 text-white">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Registration Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Registration Number</p>
                  <p className="text-sm text-slate-700 font-mono">U86100UP2023NPL194484</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">TAN Number</p>
                  <p className="text-sm text-slate-700 font-mono">MRTM14293G</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Sec 80G Certificate</p>
                  <p className="text-sm text-slate-700 font-mono">AARCM6025BF20261</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Sec 12A Certificate</p>
                  <p className="text-sm text-slate-700 font-mono">AARCM6025BE20251</p>
                </div>
                <div className="pt-2 border-t border-emerald-100">
                  <p className="text-xs text-emerald-700 font-semibold">Contact</p>
                  <p className="text-sm text-slate-700">+91 88997 00966</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Acceptance Section */}
            <section id="acceptance" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  By accessing and using Mefigure Siddhi Vadanta's website, mobile application, and related services 
                  (collectively, the "Platform"), you agree to comply with and be bound by these Terms 
                  and Conditions. If you do not agree to these terms, please do not use our Platform.
                </p>
                <p>
                  These terms constitute a legally binding agreement between you ("Patient," "User," 
                  "you") and Mefigure Siddhi Vadanta ("Company," "we," "us," "our"). By using our services, 
                  you represent that you are at least 18 years of age or have parental consent.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <p className="text-sm text-emerald-800 flex items-start gap-2">
                    <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>We reserve the right to update or modify these terms at any time without prior notice. 
                    Your continued use of the Platform following any changes constitutes acceptance of those changes.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Medical Services Section */}
            <section id="services" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">2. Medical Services</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  Mefigure Siddhi Vadanta provides a range of healthcare services including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Online appointment scheduling with healthcare providers</li>
                  <li>Telemedicine consultations</li>
                  <li>Access to medical records and lab reports</li>
                  <li>Prescription management and refill requests</li>
                  <li>Health information and educational resources</li>
                </ul>
                <p>
                  Our healthcare services are provided by licensed medical professionals. 
                  The information provided on our Platform is for informational purposes only 
                  and should not be considered as a substitute for professional medical advice, 
                  diagnosis, or treatment.
                </p>
              </div>
            </section>

            {/* Appointments Section */}
            <section id="appointments" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">3. Appointments & Cancellations</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  When scheduling appointments through our Platform, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information about your medical condition</li>
                  <li>Arrive on time for scheduled appointments (virtual or in-person)</li>
                  <li>Cancel or reschedule appointments at least 24 hours in advance</li>
                  <li>Pay any applicable fees for missed appointments or late cancellations</li>
                </ul>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Cancellation Policy: Appointments cancelled less than 2 hours before the scheduled time 
                    may be subject to a cancellation fee of ₹500.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Prescriptions Section */}
            <section id="prescriptions" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">4. Prescriptions & Medications</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  Prescriptions issued through our Platform are based on professional medical judgment. 
                  You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use prescribed medications only as directed by your healthcare provider</li>
                  <li>Report any adverse reactions or side effects immediately</li>
                  <li>Not share or misuse prescription medications</li>
                  <li>Keep medications out of reach of children</li>
                </ul>
                <p>
                  Electronic prescriptions are valid and can be filled at any registered pharmacy. 
                  We are not responsible for medication errors or interactions caused by incomplete 
                  information provided by you.
                </p>
              </div>
            </section>

            {/* Lab Reports Section */}
            <section id="lab-reports" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">5. Lab Reports & Results</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  Laboratory test results are made available through our Platform as soon as they are 
                  processed. You understand and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Test results are for informational purposes and should be discussed with your doctor</li>
                  <li>We are not responsible for delays in result processing</li>
                  <li>Critical results will be communicated directly by healthcare providers</li>
                  <li>You have the right to request physical copies of your reports</li>
                </ul>
              </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">6. Privacy & Data Protection</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  We are committed to protecting your privacy and health information in compliance 
                  with applicable laws. Our practices include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of all personal and medical data</li>
                  <li>Strict access controls to your health records</li>
                  <li>Secure transmission of information</li>
                  <li>Regular security audits and updates</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <Database className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Encrypted Data Storage</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <Eye className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Limited Access Control</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">HIPAA Compliant</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Telemedicine Section */}
            <section id="telemedicine" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">7. Telemedicine Services</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  Telemedicine consultations provide convenient access to healthcare. You agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A stable internet connection is your responsibility</li>
                  <li>You will be in a private, well-lit environment during consultations</li>
                  <li>Telemedicine may not be suitable for all medical conditions</li>
                  <li>In emergencies, you will seek immediate in-person care</li>
                </ul>
                <p>
                  Video consultations may be recorded for quality assurance and training purposes, 
                  with your prior consent.
                </p>
              </div>
            </section>

            {/* User Responsibilities Section */}
            <section id="user-responsibilities" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">8. User Responsibilities</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>As a user of our Platform, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful information about your health</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Not share your account with others</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect the rights of healthcare providers and other users</li>
                </ul>
              </div>
            </section>

            {/* Limitations Section */}
            <section id="limitations" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">9. Limitations of Liability</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  To the fullest extent permitted by law, Mefigure Siddhi Vadanta and its affiliates, officers, 
                  directors, employees, and agents shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of data, profits, or business opportunities</li>
                  <li>Delays or interruptions in service</li>
                  <li>Unauthorized access to your data</li>
                  <li>Reliance on medical information provided through the Platform</li>
                </ul>
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Emergency Disclaimer: If you are experiencing a medical emergency, 
                    please call your local emergency number immediately. Do not use our Platform 
                    for emergency services.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Amendments Section */}
            <section id="amendments" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">10. Amendments to Terms</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. 
                  When we make changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Post the updated terms on this page</li>
                  <li>Update the "Last Updated" date</li>
                  <li>Notify users via email or platform notification for significant changes</li>
                </ul>
                <p>
                  Your continued use of the Platform after any changes constitutes acceptance 
                  of the new terms. If you do not agree to the modified terms, you should 
                  discontinue using our services.
                </p>
              </div>
            </section>

            {/* Legal & Tax Information Section - NEW */}
            <section id="legal" className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden scroll-mt-20">
              <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">11. Legal & Tax Information</h2>
                </div>
              </div>
              <div className="p-6 space-y-6 text-slate-600">
                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-semibold text-emerald-800">Registration & Tax Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Registration Number</p>
                      <p className="text-base font-mono text-emerald-700 bg-white rounded-lg px-3 py-2 mt-1 border border-emerald-100">
                        U86100UP2023NPL194484
                      </p>
                      <p className="text-xs text-slate-500 mt-1">(Ministry of Corporate Affairs)</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-700">TAN Number</p>
                      <p className="text-base font-mono text-emerald-700 bg-white rounded-lg px-3 py-2 mt-1 border border-emerald-100">
                        MRTM14293G
                      </p>
                      <p className="text-xs text-slate-500 mt-1">(Tax Deduction Account Number)</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <BadgeIndianRupee className="w-4 h-4" />
                        Section 80G Certificate
                      </p>
                      <p className="text-base font-mono text-emerald-700 bg-white rounded-lg px-3 py-2 mt-1 border border-emerald-100">
                        AARCM6025BF20261
                      </p>
                      <p className="text-xs text-slate-500 mt-1">(Donations eligible for 50% tax deduction)</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" />
                        Section 12A Certificate
                      </p>
                      <p className="text-base font-mono text-emerald-700 bg-white rounded-lg px-3 py-2 mt-1 border border-emerald-100">
                        AARCM6025BE20251
                      </p>
                      <p className="text-xs text-slate-500 mt-1">(Trust Registration & Exemption)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-800">Contact Information</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    For any legal or tax-related inquiries, please contact:
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">+91 88997 00966</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">mefigureceleb@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Mefigure Siddhi Vadanta, H NO 32, VILLAGE GARHI NAWABAD, Grahi Noabad, Budhana, Muzaffarnagar</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Tax Benefits:</strong> Donations made to Mefigure Siddhi Vadanta are eligible for 
                      deduction under Section 80G of the Income Tax Act. Please consult your tax advisor 
                      for more information.
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Have Questions About Our Terms?</h3>
                  <p className="text-emerald-100 text-sm">Our team is here to help clarify any concerns</p>
                </div>
                <div className="flex gap-3">
                  <a 
                    href="mailto:mefigureceleb@gmail.com" 
                    className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                  <a 
                    href="tel:+91 8899700966" 
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-400 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}