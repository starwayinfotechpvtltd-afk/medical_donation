// app/donate/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Shield,
  CreditCard,
  Banknote,
  MapPin,
  Calendar,
  Users,
  Stethoscope,
  GraduationCap,
  Microscope,
  Award,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  FileText,
  Download,
  Printer,
  Receipt,
  ArrowRight,
  IndianRupee,
  Building2,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">(
    "one-time",
  );
  const [step, setStep] = useState(1);
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

  const amountOptions = [500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle donation submission
    console.log("Donation submitted:", {
      amount: selectedAmount || customAmount,
      type: donationType,
      ...formData,
    });
    alert(
      "Thank you for your generous donation! You will receive a confirmation email shortly.",
    );
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
      icon: GraduationCap,
      title: "Medical Education",
      description: "Scholarships for healthcare students",
      amount: 75000,
      impact: "Supports one nursing student annually",
    },
    {
      icon: Microscope,
      title: "Medical Research",
      description: "Life-saving research initiatives",
      amount: 200000,
      impact: "Funds critical research project",
    },
    {
      icon: Heart,
      title: "General Support",
      description: "Where most needed",
      amount: 10000,
      impact: "Flexible support for hospital needs",
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
                    Choose how you'd like to donate
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Donation Type Toggle */}
                  <div className="flex gap-3 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDonationType("one-time")}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        donationType === "one-time"
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      One Time
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType("monthly")}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        donationType === "monthly"
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>

                  {/* Amount Options */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Select Amount (₹)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                      {amountOptions.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedAmount === amount
                              ? "bg-emerald-600 text-white shadow-md"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
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
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    <Heart className="w-4 h-4 inline mr-2" />
                    Donate Now
                  </button>

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
                        Account Name: MediCare Foundation
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
                        UPI ID: medicare@icici
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Our Impact in Action
              </h2>
              <p className="text-slate-500">
                See how your donations are making a difference
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-[280px] md:h-[320px] relative">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                pagination={{ clickable: true }}
                className="w-full h-full"
              >
                {slides.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Healthcare Impact ${index}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm opacity-90">
                          Making healthcare accessible for all
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
