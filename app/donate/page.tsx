"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  Shield,
  Users,
  Stethoscope,
  Microscope,
  Award,
  Receipt,
  Building2,
  BadgeCheck,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApiException } from "@/lib/api-client";
import { donationApi } from "@/lib/donation-api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function DonationPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    message: "",
    anonymous: false,
    taxBenefit: true,
  });

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
  };

  const ensureRazorpayLoaded = async () => {
    if (window.Razorpay) return true;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
      document.body.appendChild(script);
    });
    return !!window.Razorpay;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    const amount = Number(customAmount);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setSubmitError("Please enter a valid donation amount.");
      return;
    }

    const donorDetails = [
      formData.fullName ? `Name: ${formData.fullName}` : "",
      formData.email ? `Email: ${formData.email}` : "",
      formData.phone ? `Phone: ${formData.phone}` : "",
      formData.message ? `Message: ${formData.message}` : "",
    ]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 500);

    try {
      setIsSubmitting(true);
      const response = await donationApi.donate({
        amount,
        currency: "INR",
        payment_method: "other",
        donor_name: formData.fullName.trim(),
        donor_email: formData.email.trim(),
        donor_phone: formData.phone.trim(),
        donor_pan: formData.panNumber.trim() || null,
        donor_address: [formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(", ") || null,
        is_anonymous: formData.anonymous,
        donor_message: donorDetails || null,
      });
      const init = response.data;
      if (!init) throw new Error("Donation initiation failed.");

      const loaded = await ensureRazorpayLoaded();
      if (!loaded || !window.Razorpay) throw new Error("Razorpay SDK not available.");

      const rz = new window.Razorpay({
        key: init.razorpay_key_id,
        amount: init.amount,
        currency: init.currency,
        name: "HospitalMS",
        description: "Donation - General",
        order_id: init.razorpay_order_id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (rzp: Record<string, string>) => {
          try {
            const verify = await donationApi.verifyPayment({
              razorpay_order_id: rzp.razorpay_order_id,
              razorpay_payment_id: rzp.razorpay_payment_id,
              razorpay_signature: rzp.razorpay_signature,
            });
            setSubmitMessage(
              verify.data?.transaction_ref
                ? `Thank you for your generous donation. Reference: ${verify.data.transaction_ref}`
                : "Thank you for your generous donation.",
            );
            setCustomAmount("");
            setFormData((prev) => ({ ...prev, message: "" }));
          } catch (verifyErr) {
            setSubmitError(
              verifyErr instanceof ApiException
                ? verifyErr.message
                : "Payment captured, but verification failed. Please contact support.",
            );
          }
        },
        theme: { color: "#059669" },
      });

      rz.open();
    } catch (err) {
      setSubmitError(
        err instanceof ApiException
          ? err.message
          : "Unable to submit your donation right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

const impacts = [
  {
    icon: Shield,
    title: "Medical Equipment",
    description: "Advanced diagnostic and treatment equipment",
    amount: 50000,
    impact: "Supports one medical device purchase",
  },
  {
    icon: Users,
    title: "Patient Care",
    description: "Free treatments for underprivileged patients",
    amount: 25000,
    impact: "Covers treatment for 10 patients",
  },
  {
    icon: Stethoscope,
    title: "Emergency Services",
    description: "24/7 emergency response support",
    amount: 100000,
    impact: "Funds emergency ambulance operations",
  },
  {
    icon: Heart,
    title: "Child Healthcare",
    description: "Essential treatment and nutrition for children",
    amount: 60000,
    impact: "Supports healthcare for 20 children",
  },
  {
    icon: Microscope,
    title: "Medical Research",
    description: "Life-saving research initiatives",
    amount: 200000,
    impact: "Funds critical research project",
  },
  {
    icon: Users,
    title: "Senior Citizen Care",
    description: "Healthcare assistance for elderly patients",
    amount: 40000,
    impact: "Provides care for 15 senior citizens",
  },
];

  const slides = [
    "/images/home/hero_image_2.webp",
    "/images/home/hero_image_3.jpg",
    "/images/home/hero_image_4.png",
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 fill-white" />
              <h1 className="text-3xl md:text-5xl font-bold">
                Make a Donation
              </h1>
            </div>
            <p className="text-emerald-100 text-lg max-w-2xl">
              Your generous contribution helps us provide quality healthcare to
              those in need. Every donation, no matter the size, makes a
              difference.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-sm">80G Tax Exempted</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Receipt className="w-4 h-4" />
                <span className="text-sm">Instant Receipt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Impact Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Where Your Donation Goes
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Your contribution directly supports our mission to provide
                quality healthcare for all
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impacts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {item.description}
                    </p>
                    <p className="text-emerald-600 font-semibold">
                      ₹{item.amount.toLocaleString()}+
                    </p>
                    <p className="text-xs text-slate-400 mt-2">{item.impact}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donation Form Section */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Column - Donation Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-8">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-transparent">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Donation Amount
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Enter your donation details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Secure payment is powered by Razorpay (UPI, Card, NetBanking, Wallet).
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Enter Donation Amount (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min={1}
                        required
                        className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Tax Benefit Note */}
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">
                          Tax Benefit Available
                        </p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Your donation is eligible for 50% deduction under
                          Section 80G of the Income Tax Act. Tax exemption
                          certificate will be provided.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          PAN Number (for tax benefit)
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          placeholder="ABCDE1234F"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special instructions or dedication..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">
                        Donate anonymously
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="taxBenefit"
                        checked={formData.taxBenefit}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">
                        I want to claim tax benefit under Section 80G
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Heart className="w-4 h-4 inline mr-2" />
                    {isSubmitting ? "Processing..." : "Donate Now"}
                  </button>

                  {submitMessage && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      {submitMessage}
                    </div>
                  )}

                  {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <p className="text-xs text-center text-slate-500">
                    By donating, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-emerald-600 hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and
                    <Link
                      href="/privacy"
                      className="text-emerald-600 hover:underline ml-1"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            {/* Right Column - Information */}
            <div className="space-y-6">
              {/* Impact Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Our Impact So Far
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">
                      50,000+
                    </p>
                    <p className="text-xs text-slate-500">Lives Impacted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">₹5Cr+</p>
                    <p className="text-xs text-slate-500">Raised Annually</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">85%</p>
                    <p className="text-xs text-slate-500">Goes to Programs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">500+</p>
                    <p className="text-xs text-slate-500">Regular Donors</p>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Registration Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500">Registration Number</p>
                    <p className="font-mono text-slate-800">
                      U86100UP2023NPL194484
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">TAN Number</p>
                    <p className="font-mono text-slate-800">MRTM14293G</p>
                  </div>
                  <div>
                    <p className="text-slate-500">80G Certificate</p>
                    <p className="font-mono text-slate-800">AARCM6025BF20261</p>
                  </div>
                  <div>
                    <p className="text-slate-500">12A Certificate</p>
                    <p className="font-mono text-slate-800">AARCM6025BE20251</p>
                  </div>
                </div>
              </div>

              {/* Alternative Payment Methods */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Other Ways to Donate
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Bank Transfer
                    </p>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-sm">
                      <p className="text-slate-500">
                        Account Name: Mefigure Siddhi Vadanta
                      </p>
                      <p className="text-slate-500">Account No: 123456789012</p>
                      <p className="text-slate-500">IFSC Code: SBIN0012345</p>
                      <p className="text-slate-500">
                        Bank: State Bank of India
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      UPI / QR Code
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-emerald-200">
                        <Heart className="w-12 h-12 text-emerald-500" />
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        UPI ID: mefigure@icici
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Testimonials */}
          <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                What Our Donors Say
              </h2>
              <p className="text-slate-500">
                Heartfelt stories from our generous supporters
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Rajesh Sharma",
                  amount: "₹25,000",
                  message:
                    "Proud to support such a noble cause. The transparency and impact reporting is exceptional.",
                  location: "Mumbai",
                },
                {
                  name: "Priya Patel",
                  amount: "₹10,000 (Monthly)",
                  message:
                    "Being a monthly donor gives me satisfaction knowing I'm consistently helping those in need.",
                  location: "Delhi",
                },
                {
                  name: "Dr. Amit Kumar",
                  amount: "₹1,00,000",
                  message:
                    "As a doctor, I understand the importance of quality healthcare for everyone. Happy to contribute.",
                  location: "Bangalore",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    "{testimonial.message}"
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                    <Heart className="w-3 h-3" />
                    Donated {testimonial.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Is my donation tax deductible?",
                  a: "Yes, all donations are eligible for 50% deduction under Section 80G of the Income Tax Act. You will receive a tax exemption certificate.",
                },
                {
                  q: "How is my donation used?",
                  a: "85% of funds go directly to patient care and medical equipment. 10% for operations, and 5% for fundraising and administration.",
                },
                {
                  q: "Will I receive a receipt?",
                  a: "Yes, you will receive an instant receipt via email after successful donation.",
                },
                {
                  q: "Can I donate in memory of someone?",
                  a: "Yes, you can dedicate your donation. Please mention in the message section.",
                },
                {
                  q: "Is my payment secure?",
                  a: "Yes, we use industry-standard encryption to protect your payment information.",
                },
                {
                  q: "Can I change my monthly donation?",
                  a: "Yes, you can update or cancel your monthly donation anytime by contacting our support team.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-slate-100 pb-3">
                  <p className="font-semibold text-slate-800 mb-1">{faq.q}</p>
                  <p className="text-sm text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
