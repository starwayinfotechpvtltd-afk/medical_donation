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
  Baby,
  Flower2,
  Ambulance,
  Brain,
  Bone,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  TrendingUp,
  Globe,
  HandshakeIcon,
  Star,
  Quote,
  Calendar,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApiException } from "@/lib/api-client";
import { donationApi } from "@/lib/donation-api";
import PageHero from "@/components/PageHero";

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

  // Expanded impacts array with more categories
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
    {
      icon: Baby,
      title: "Maternal Health",
      description: "Prenatal & postnatal care for mothers",
      amount: 35000,
      impact: "Supports 25 mothers and newborns",
    },
    {
      icon: Brain,
      title: "Mental Health",
      description: "Counseling and psychiatric support",
      amount: 45000,
      impact: "Provides 100 therapy sessions",
    },
    {
      icon: Bone,
      title: "Orthopedic Care",
      description: "Surgeries and rehabilitation",
      amount: 75000,
      impact: "Enables 5 life-changing surgeries",
    },
  ];

  // Big Paragraph Cards - New section following same pattern
  const bigParagraphCards = [
    {
      icon: Target,
      title: "Our Mission & Vision",
      paragraphs: [
        "At Healthcare Foundation, we believe that quality healthcare is a fundamental right, not a privilege. Our mission is to bridge the gap between medical needs and accessibility by providing free and affordable healthcare services to underserved communities across India. We strive to create a world where no one dies due to lack of medical attention or financial constraints.",
        "Every day, thousands of families face the impossible choice between basic necessities and life-saving medical treatment. Our foundation was established to eliminate this dilemma by creating a sustainable ecosystem of healthcare delivery, community outreach, and patient assistance programs. We work tirelessly to ensure that every individual, regardless of their economic background, receives dignified and compassionate medical care.",
        "Through your generous support, we have already impacted over 50,000 lives across 15 states. Our vision extends to reaching every corner of the country, establishing mobile health units, telemedicine facilities, and partnering with local hospitals to create a comprehensive healthcare network that leaves no one behind."
      ],
      buttonText: "Learn About Our Impact",
      buttonLink: "/impact",
    },
    {
      icon: TrendingUp,
      title: "How Your Donation Creates Change",
      paragraphs: [
        "Every rupee you donate to our foundation is carefully allocated to maximize impact and reach. Our financial model ensures that 85% of all donations go directly to patient care and medical programs. This includes funding critical surgeries, providing life-saving medications, supporting preventive healthcare camps, and maintaining our fleet of emergency ambulances.",
        "The remaining 15% is strategically divided between operational costs (10%) and fundraising & administration (5%). We maintain complete financial transparency, providing detailed annual reports and impact statements to all our donors. Our low overhead model ensures that your contribution makes the maximum possible difference in someone's life.",
        "When you donate ₹25,000, you're not just giving money - you're providing a cancer patient with a month of chemotherapy, enabling a child's heart surgery, or funding a mobile health camp that serves 500 people. Your donation directly translates into lives saved, families kept together, and communities strengthened."
      ],
      buttonText: "View Financial Reports",
      buttonLink: "/financials",
    },
    {
      icon: HandshakeIcon,
      title: "Corporate Partnerships & CSR",
      paragraphs: [
        "We welcome corporate partnerships and CSR initiatives that align with our mission of accessible healthcare. Many leading organizations have chosen us as their healthcare impact partner, leveraging their CSR budgets to create meaningful change in communities where they operate. We offer customized partnership programs that address specific healthcare needs while meeting corporate social responsibility objectives.",
        "Our corporate partners benefit from comprehensive impact reports, employee engagement opportunities, and recognition in our communications. We work closely with partner organizations to design programs that maximize both social impact and business value, including health camps for employees' families, sponsorship of medical equipment for local hospitals, and support for our emergency response systems.",
        "Whether you're a small business looking to make a local impact or a multinational corporation with extensive CSR commitments, we have partnership models that can be tailored to your goals. Contact our corporate relations team to explore how we can work together to save lives and build healthier communities."
      ],
      buttonText: "Explore Partnerships",
      buttonLink: "/corporate-partners",
    },
    {
      icon: Globe,
      title: "Community Outreach Programs",
      paragraphs: [
        "Our community outreach programs extend far beyond hospital walls. We conduct regular health awareness camps in rural and urban slum areas, focusing on preventive healthcare, maternal and child health, nutrition education, and early disease detection. These programs have been instrumental in identifying health issues before they become critical, saving countless lives through early intervention.",
        "We also run specialized programs for tuberculosis control, diabetes management, hypertension screening, and mental health awareness. Our team of community health workers receives rigorous training and works directly with local communities, building trust and ensuring that healthcare information and services reach the most vulnerable populations.",
        "In addition to medical services, we provide health education workshops in schools and colleges, training young people to become health ambassadors in their communities. Our seasonal health camps address region-specific health concerns, from heatstroke prevention in summer to respiratory care during pollution peaks. Every program is designed with cultural sensitivity and community participation at its core."
      ],
      buttonText: "See Our Programs",
      buttonLink: "/programs",
    },
  ];

  // Expanded testimonials
  const testimonials = [
    {
      name: "Rajesh Sharma",
      amount: "₹25,000",
      message: "Proud to support such a noble cause. The transparency and impact reporting is exceptional. I've been a donor for 3 years now, and seeing the lives changed through my contributions brings me immense joy.",
      location: "Mumbai",
      rating: 5,
    },
    {
      name: "Priya Patel",
      amount: "₹10,000 (Monthly)",
      message: "Being a monthly donor gives me satisfaction knowing I'm consistently helping those in need. The foundation's work ethic and dedication to patient care is truly inspiring.",
      location: "Delhi",
      rating: 5,
    },
    {
      name: "Dr. Amit Kumar",
      amount: "₹100,000",
      message: "As a doctor, I understand the importance of quality healthcare for everyone. Happy to contribute and be part of this wonderful initiative that makes healthcare accessible to all.",
      location: "Bangalore",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      amount: "₹50,000",
      message: "Incredible work they're doing for the community. The foundation's commitment to transparency and their detailed impact reports give me confidence that my donation is being used effectively.",
      location: "Hyderabad",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      amount: "₹5,000 (Monthly)",
      message: "Small contributions can make big differences. I started with a small monthly donation, and seeing the cumulative impact over 2 years has been truly motivating.",
      location: "Pune",
      rating: 5,
    },
    {
      name: "Anita Desai",
      amount: "₹75,000",
      message: "When my father needed emergency care, I understood the value of accessible healthcare. Now I donate to ensure others don't face the same financial struggles during medical emergencies.",
      location: "Kolkata",
      rating: 5,
    },
  ];

  // Expanded FAQ section
  const faqs = [
    {
      q: "Is my donation tax deductible?",
      a: "Yes, all donations are eligible for 50% deduction under Section 80G of the Income Tax Act. You will receive a tax exemption certificate via email within 7 business days of your donation.",
    },
    {
      q: "How is my donation used?",
      a: "85% of funds go directly to patient care and medical equipment. 10% for operations, and 5% for fundraising and administration. We maintain complete financial transparency and provide detailed annual reports.",
    },
    {
      q: "Will I receive a receipt?",
      a: "Yes, you will receive an instant receipt via email after successful donation. For tax purposes, a separate 80G certificate will be emailed within 7 business days.",
    },
    {
      q: "Can I donate in memory of someone?",
      a: "Yes, you can dedicate your donation. Please mention in the message section, and we'll send a special acknowledgment to the family if you provide their contact details.",
    },
    {
      q: "Is my payment secure?",
      a: "Yes, we use industry-standard 256-bit encryption and PCI-compliant payment gateways to protect your payment information. We never store your credit/debit card details.",
    },
    {
      q: "Can I change my monthly donation?",
      a: "Yes, you can update, pause, or cancel your monthly donation anytime by contacting our support team at mefigureceleb@gmail.com or calling +91-8899700966.",
    },
    {
      q: "Can I donate from outside India?",
      a: "Yes, international donations are accepted through our secure payment gateway. FCRA compliant donations are processed with proper documentation for foreign contributors.",
    },
    {
      q: "How do I get my 80G certificate?",
      a: "The certificate is automatically generated and sent to your registered email within 7 business days. You can also download it from our donor portal after logging in.",
    },
    {
      q: "Do you accept corporate donations?",
      a: "Yes, we have special programs for corporate partnerships and CSR initiatives. Please contact our corporate relations team at corporate@hospitalms.org for customized partnership opportunities.",
    },
    {
      q: "What is the minimum donation amount?",
      a: "The minimum donation amount is ₹100. Every contribution, no matter how small, makes a difference in someone's life.",
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
        <PageHero
          badge="Healthcare Foundation"
          icon={Heart}
          title="Together We Can Save Lives"
          description="By supporting our foundation, you help fund critical healthcare services, medical outreach initiatives, patient assistance programs, and life-changing treatments for underserved communities. Your generosity empowers us to make quality healthcare accessible to all."
          breadcrumb={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Donate",
            },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


          {/* Donation Form Section */}
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
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

                  {/* Suggested Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Suggested Amounts
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomAmount(amt.toString())}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                        >
                          ₹{amt}
                        </button>
                      ))}
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
              {/* Impact Stats - Expanded */}
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
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">25+</p>
                    <p className="text-xs text-slate-500">Partner Hospitals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">15</p>
                    <p className="text-xs text-slate-500">States Covered</p>
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
                  <div>
                    <p className="text-slate-500">FCRA Registration</p>
                    <p className="font-mono text-slate-800">FCRA/2024/123456</p>
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
                        Account Name: Mefigure Siddhi Vadanta foundation
                      </p>
                      <p className="text-slate-500">Account No: 95952100003204</p>
                      <p className="text-slate-500">IFSC Code: BARB0BUPGBX</p>
                      <p className="text-slate-500">
                        Bank: Uttar pradesh gramin bank
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      UPI / QR Code
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="relative w-100 h-100 mx-auto overflow-hidden">
                        <Image
                          src="/images/upi-scr.png"
                          alt="UPI QR Code"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Impact Section - Expanded with more cards */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Where Your Donation Goes
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Your contribution directly supports our mission to provide
                quality healthcare for all. Here's how your generosity creates
                impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impacts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {item.description}
                    </p>
                    <p className="text-emerald-600 font-semibold">
                      ₹{new Intl.NumberFormat("en-IN").format(item.amount)}+
                    </p>
                    <p className="text-xs text-slate-400 mt-2">{item.impact}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Big Paragraph Cards Section - NEW SECTION following same pattern */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Understanding Our Work
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Dive deeper into our mission, impact model, and how your support
                transforms healthcare accessibility across India
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bigParagraphCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {card.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-slate-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials - Expanded with rating stars */}
          <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Quote className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Our Donors Say
              </h2>
              <p className="text-slate-500">
                Heartfelt stories from our generous supporters
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                      ))}
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

          {/* FAQ Section - Expanded with more questions */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500">
                Find answers to common questions about donating
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-100 pb-3 hover:bg-slate-50 p-3 rounded-lg transition-colors">
                  <p className="font-semibold text-slate-800 mb-1 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-slate-500 pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Still have questions?{" "}
                <Link href="/contact" className="text-emerald-600 hover:underline font-semibold">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>

          {/* Call to Action Banner - New Section */}
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Make a Difference?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Your donation today can save lives and bring hope to those who need it most.
              Every contribution, no matter the size, creates ripples of positive change.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}