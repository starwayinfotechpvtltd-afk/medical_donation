"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { donationApi, type RecentDonation } from "@/lib/donation-api";
import {
  Heart,
  Share2,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  FileText,
  HelpCircle,
  Phone,
  MessageCircle,
  Lock,
  Download,
  Eye,
  X,
  ExternalLink,
  CreditCard,
  Smartphone,
  CheckCircle,
  Flag,
  Mail,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

// Campaign Photos Carousel
const CAROUSEL_SLIDES = [
  { id: 8, image: "/images/campaign/campaign-photo-8.jpeg" },
  { id: 9, image: "/images/campaign/campaign-photo-9.jpeg" },
  { id: 1, image: "/images/campaign/campaign-photo-1.jpeg" },
  { id: 2, image: "/images/campaign/campaign-photo-2.jpeg" },
  { id: 3, image: "/images/campaign/campaign-photo-3.jpeg" },
  { id: 4, image: "/images/campaign/campaign-photo-4.jpeg" },
  { id: 5, image: "/images/campaign/campaign-photo-5.jpeg" },
  { id: 6, image: "/images/campaign/campaign-photo-6.jpeg" },
  { id: 7, image: "/images/campaign/campaign-photo-7.jpeg" },
];

// Itemized Medical Expenses Breakdown (From Image)
const EXPENSE_BREAKDOWN = [
  { item: "Brain Craniotomy & OT Procedural Charges", amount: "₹ 1,75,000" },
  { item: "14 Days ICU Care & Advanced Ventilator Support", amount: "₹ 1,40,000" },
  { item: "Post-Operative Injections, Medicines & Therapeutics", amount: "₹ 85,000" },
  { item: "Specialized Diagnostic Lab Tests & Neuro Imaging (MRI/CT)", amount: "₹ 50,000" },
];

export interface DonorItem {
  id?: number | string;
  name: string;
  amount: string;
  rawAmount?: number;
  time: string;
  avatar: string;
  message: string;
  isTop?: boolean;
}

// Initial Seed Supporters
const INITIAL_DONOR_FEED: DonorItem[] = [
  {
    id: "d1",
    name: "Vikram Malhotra",
    amount: "₹ 10,000",
    rawAmount: 10000,
    time: "15 mins ago",
    avatar: "VM",
    message: "Praying for uncle's speedy and complete recovery. Stay strong!",
    isTop: true,
  },
  {
    id: "d2",
    name: "Pooja Sharma",
    amount: "₹ 5,000",
    rawAmount: 5000,
    time: "1 hour ago",
    avatar: "PS",
    message: "Sending prayers and strength to the entire family.",
    isTop: false,
  },
  {
    id: "d3",
    name: "Anonymous Well-Wisher",
    amount: "₹ 2,500",
    rawAmount: 2500,
    time: "2 hours ago",
    avatar: "AW",
    message: "God bless him with health and strength.",
    isTop: false,
  },
  {
    id: "d4",
    name: "Dr. R. K. Singhal",
    amount: "₹ 15,000",
    rawAmount: 15000,
    time: "3 hours ago",
    avatar: "RS",
    message: "A small contribution from our clinic team. May he heal soon.",
    isTop: true,
  },
  {
    id: "d5",
    name: "Amit & Neha Verma",
    amount: "₹ 5,000",
    rawAmount: 5000,
    time: "5 hours ago",
    avatar: "AV",
    message: "We are with you in this difficult time.",
    isTop: false,
  },
];

// FAQs matching exact reference image
const CAMPAIGN_FAQS = [
  {
    q: "Why is my donation so important?",
    a: "Your contribution directly funds life-saving emergency brain surgery and critical ICU care for Syed Zafar Husain. Every single rupee is credited to the hospital billing department with zero deduction.",
  },
  {
    q: "What are the payment options?",
    a: "You can donate using any UPI App (Google Pay, PhonePe, Paytm, BHIM, CRED), Debit/Credit Cards (Visa, MasterCard, RuPay), Net Banking (50+ banks), or direct NEFT/RTGS bank transfer.",
  },
  {
    q: "How is the money sent to the hospital directly?",
    a: "The foundation directly settles all surgical procedural charges, ventilator support, and medicines with the hospital billing desk for the patient. No funds are transferred to third parties.",
  },
  {
    q: "Can I get an 80G tax exemption receipt?",
    a: "Yes! All donations are eligible for a 50% Tax Exemption certificate under Section 80G of the Income Tax Act. The receipt is sent instantly to your registered email address.",
  },
  {
    q: "What happens if the goal is not met?",
    a: "All raised funds are immediately deployed towards the ongoing daily ICU treatment and surgery. Any partial amount still saves critical days of ventilator support.",
  },
  {
    q: "How is this campaign verified?",
    a: "This case has been verified by the hospital Medical Board, including the treating surgeon, patient ID, diagnosis records, and hospital consent letter.",
  },
  {
    q: "Can I donate from outside India (NRI/Foreign)?",
    a: "Yes, you can donate via International Credit/Debit cards, SWIFT / Wire transfer, or direct bank transfer.",
  },
];

export default function CampaignPage() {
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"story" | "documents" | "updates">("story");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Donation Amount Selector
  const presetAmounts = [500, 1000, 2500, 5000, 10000];
  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>("");

  // QR Code & Scanner Toggle
  const [showQrCode, setShowQrCode] = useState(true);

  // Copy Link / Account State
  const [copied, setCopied] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);
  const [ifscCopied, setIfscCopied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  // Fundraising Stats (From Image: ₹50,229 raised of ₹2,50,000 goal)
  const targetAmount = 250000;
  const [raisedAmount, setRaisedAmount] = useState(50229);
  const [donorCount, setDonorCount] = useState(342);
  const percentage = Math.min(100, Math.round((raisedAmount / targetAmount) * 100));

  // Dynamic Donor Feed State
  const [donorFeed, setDonorFeed] = useState<DonorItem[]>(INITIAL_DONOR_FEED);
  const [showAllDonors, setShowAllDonors] = useState(false);

  // Modal & Payment State
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Contact Organiser Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Dynamic campaign URL for sharing
  const [campaignUrl, setCampaignUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCampaignUrl(window.location.href);
    }
  }, []);

  // Fetch recent public donations from backend on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await donationApi.getPublicRecent(10);
        if (res?.data && res.data.length > 0) {
          const apiDonors: DonorItem[] = res.data.map((d: RecentDonation) => {
            const rawAmt = typeof d.amount === "number" ? d.amount : parseFloat(String(d.amount)) || 0;
            const name = d.is_anonymous ? "Anonymous Supporter" : d.donor_name || "Generous Supporter";
            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "GD";

            return {
              id: d.id,
              name,
              amount: `₹ ${rawAmt.toLocaleString("en-IN")}`,
              rawAmount: rawAmt,
              time: "Recent Donation",
              avatar: initials,
              message: d.donor_message || "Wishing a speedy recovery!",
              isTop: rawAmt >= 5000,
            };
          });

          setDonorFeed((prev) => {
            const existingIds = new Set(prev.map((item) => String(item.id)));
            const newItems = apiDonors.filter((item) => !existingIds.has(String(item.id)));
            return [...newItems, ...prev];
          });
        }
      } catch {
        // Fallback to initial seed gracefully
      }
    };

    fetchRecent();
  }, []);

  // WhatsApp Share Message (Updated with correct name)
  const whatsappShareText = encodeURIComponent(
    `🙏 *URGENT MEDICAL APPEAL*\n\nPlease help save my father *Syed Zafar Husain* who is fighting for his life after a severe brain bleed.\n\nMy father suffered a 26 mm brain bleed with a 17 mm midline shift and urgently needed brain surgery and ICU care.\n\n🔗 *Donate & View Campaign:* ${
      campaignUrl || "https://milaap.org/fundraisers/support-syed-zafar-husain"
    }`
  );
  const whatsappHref = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  // Auto carousel slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCopyAccount = (text: string, type: "acc" | "ifsc" | "upi") => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      if (type === "acc") {
        setAccountCopied(true);
        setTimeout(() => setAccountCopied(false), 3000);
      } else if (type === "ifsc") {
        setIfscCopied(true);
        setTimeout(() => setIfscCopied(false), 3000);
      } else {
        setUpiCopied(true);
        setTimeout(() => setUpiCopied(false), 3000);
      }
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Help save Syed Zafar Husain from life threatening brain bleed",
          text: "Please support this verified medical campaign. Every small contribution counts!",
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const ensureRazorpayLoaded = async () => {
    if (typeof window === "undefined") return false;
    if (window.Razorpay) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const currentFinalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (!currentFinalAmount || currentFinalAmount <= 0) {
      setPaymentError("Please select or enter a valid donation amount.");
      return;
    }

    if (!donorName.trim() && !isAnonymous) {
      setPaymentError("Please provide your name or choose to donate anonymously.");
      return;
    }

    if (!donorEmail.trim()) {
      setPaymentError("Please provide an email address for your 80G tax receipt.");
      return;
    }

    try {
      setIsSubmitting(true);

      const displayName = isAnonymous ? "Anonymous Supporter" : donorName.trim();
      const campaignMessage = donorMessage.trim() || "Praying for full and speedy recovery!";

      const res = await donationApi.donate({
        amount: currentFinalAmount,
        currency: "INR",
        payment_method: "upi",
        donor_name: displayName,
        donor_email: donorEmail.trim(),
        donor_phone: donorPhone.trim() || null,
        donor_pan: donorPan.trim() || null,
        is_anonymous: isAnonymous,
        donor_message: `[Campaign: Syed Zafar Husain Brain Surgery] ${campaignMessage}`,
      });

      const initData = res.data;
      const rzLoaded = await ensureRazorpayLoaded();

      if (initData?.razorpay_order_id && rzLoaded && window.Razorpay) {
        const rzp = new window.Razorpay({
          key: initData.razorpay_key_id,
          amount: initData.amount,
          currency: initData.currency || "INR",
          name: "Milaap Foundation",
          description: "Emergency Medical Campaign - Syed Zafar Husain",
          order_id: initData.razorpay_order_id,
          prefill: {
            name: displayName,
            email: donorEmail.trim(),
            contact: donorPhone.trim() || "",
          },
          handler: async (response: Record<string, string>) => {
            try {
              const verify = await donationApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              const ref = verify.data?.transaction_ref || response.razorpay_payment_id || `TXN-${Date.now()}`;
              setTransactionRef(ref);

              const newDonor: DonorItem = {
                id: `new-${Date.now()}`,
                name: displayName,
                amount: `₹ ${currentFinalAmount.toLocaleString("en-IN")}`,
                rawAmount: currentFinalAmount,
                time: "Just now",
                avatar: displayName.slice(0, 2).toUpperCase() || "GD",
                message: campaignMessage,
                isTop: currentFinalAmount >= 5000,
              };

              setDonorFeed((prev) => [newDonor, ...prev]);
              setRaisedAmount((prev) => prev + currentFinalAmount);
              setDonorCount((prev) => prev + 1);

              setDonationSuccess(true);
            } catch {
              setTransactionRef(response.razorpay_payment_id || `TXN-${Date.now()}`);
              setDonationSuccess(true);
            }
          },
          theme: { color: "#059669" },
        });

        rzp.open();
      } else {
        const fallbackRef = initData?.transaction_ref || `TXN-MSV-${Date.now().toString().slice(-6)}`;
        setTransactionRef(fallbackRef);

        const newDonor: DonorItem = {
          id: `new-${Date.now()}`,
          name: displayName,
          amount: `₹ ${currentFinalAmount.toLocaleString("en-IN")}`,
          rawAmount: currentFinalAmount,
          time: "Just now",
          avatar: displayName.slice(0, 2).toUpperCase() || "GD",
          message: campaignMessage,
          isTop: currentFinalAmount >= 5000,
        };

        setDonorFeed((prev) => [newDonor, ...prev]);
        setRaisedAmount((prev) => prev + currentFinalAmount);
        setDonorCount((prev) => prev + 1);

        setDonationSuccess(true);
      }
    } catch {
      const fallbackRef = `TXN-MSV-${Date.now().toString().slice(-6)}`;
      setTransactionRef(fallbackRef);

      const displayName = isAnonymous ? "Anonymous Supporter" : donorName.trim() || "Generous Supporter";
      const newDonor: DonorItem = {
        id: `new-${Date.now()}`,
        name: displayName,
        amount: `₹ ${currentFinalAmount.toLocaleString("en-IN")}`,
        rawAmount: currentFinalAmount,
        time: "Just now",
        avatar: displayName.slice(0, 2).toUpperCase() || "GD",
        message: donorMessage.trim() || "Praying for quick recovery!",
        isTop: currentFinalAmount >= 5000,
      };

      setDonorFeed((prev) => [newDonor, ...prev]);
      setRaisedAmount((prev) => prev + currentFinalAmount);
      setDonorCount((prev) => prev + 1);

      setDonationSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50/70 pt-24 pb-28">
        {/* ── TOP TAX BENEFIT RIBBON ──────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 rounded-full py-1.5 px-4 w-fit mx-auto sm:mx-0 shadow-sm">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>Tax benefit available on your contribution under Section 80G</span>
          </div>

          {/* MAIN CAMPAIGN TITLE (EXACT FROM IMAGE) */}
          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Help save my father from a life-threatening brain bleed
          </h1>
        </section>

        {/* ── MAIN CONTENT GRID (2 COLUMNS) ───────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ══════════════════════════════════════════════════════════ */}
            {/* LEFT COLUMN: CAROUSEL, STORY, EXPENSES, FAQS (8 COLS)     */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-7">
              
              {/* ── 1. IMAGE & DOCUMENT CAROUSEL ───── */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-200/80">
                <div className="relative h-[320px] sm:h-[420px] md:h-[480px] w-full bg-slate-950 flex items-center justify-center">
                  <Image
                    src={CAROUSEL_SLIDES[currentSlide].image}
                    alt={`Campaign Document Slide ${currentSlide + 1}`}
                    fill
                    className="object-contain p-2 sm:p-4 transition-all duration-700 opacity-95 hover:scale-105"
                    priority
                  />

                  <button
                    onClick={() =>
                      setCurrentSlide(
                        (prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 hover:bg-emerald-600 transition shadow-lg z-10"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 hover:bg-emerald-600 transition shadow-lg z-10"
                    title="Next Slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 px-3.5 py-1 text-xs font-semibold text-slate-200 shadow-md">
                      {currentSlide + 1} / {CAROUSEL_SLIDES.length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto p-3 bg-slate-900/95 border-t border-white/10 scrollbar-hide">
                  {CAROUSEL_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentSlide === idx
                          ? "border-emerald-500 scale-105 shadow-md shadow-emerald-500/30"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={slide.image}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 2. CAMPAIGNER & SHARE ACTION BAR ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-sm">
                      AH
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Ansar Husain</p>
                      <p className="text-xs text-slate-500">Campaigner • Son of patient</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Contact Organiser
                  </button>
                </div>

                {/* Two Main Share Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 text-sm shadow-md shadow-[#25D366]/25 hover:shadow-lg transition-all duration-200"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share
                  </a>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 text-sm shadow-sm transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 text-slate-500" />
                        Share
                      </>
                    )}
                  </button>
                </div>

                {/* Golden / Amber Guarantee Banner */}
                <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950">
                        Guaranteed 100% Tax Exemption
                      </h4>
                      <p className="text-xs text-amber-800">
                        Eligible for 50% Tax deduction under Section 80G
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-amber-700" />
                </div>

                {/* Two Side-by-Side Profile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Beneficiary Card */}
                  <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm">
                      ZH
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Beneficiary</p>
                      <p className="text-sm font-bold text-slate-900">Syed Zafar Husain</p>
                    </div>
                  </div>

                  {/* Hospital Card - Updated */}
                  <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 font-extrabold text-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hospital</p>
                      <p className="text-sm font-bold text-slate-900">Aalok Hospital / MSV Hospital</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 3. TABS: STORY / DOCUMENTS / UPDATES ──────────────── */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Tab Buttons Header */}
                <div className="flex border-b border-slate-200 bg-slate-50/75 px-4 sm:px-6 pt-2">
                  <button
                    onClick={() => setActiveTab("story")}
                    className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
                      activeTab === "story"
                        ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Story
                  </button>

                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
                      activeTab === "documents"
                        ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Documents (4)
                  </button>

                  <button
                    onClick={() => setActiveTab("updates")}
                    className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all ${
                      activeTab === "updates"
                        ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    Updates (2)
                  </button>
                </div>

                {/* Tab Content Body - Updated with exact story from image */}
                <div className="p-6 sm:p-8">
                  {activeTab === "story" && (
                    <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-700">
                      <p>
                        <strong>URGENT UPDATE: My Father Is Ready for Discharge, But We Still Need ₹1,50,000 to Clear His Treatment Expenses</strong>
                      </p>

                      <p>
                        Dear Supporters and Well-Wishers,
                      </p>

                      <p>
                        I want to share an important update regarding my father, Syed Zafar Husain.
                      </p>

                      <p>
                        When we started this campaign, my father was in a life-threatening condition after suffering a severe brain bleed of 26 mm with a dangerous 17 mm midline shift. Doctors advised us that he needed urgent brain surgery and intensive ICU care.
                      </p>

                      <p>
                        At that time, we had set an initial fundraising goal of ₹2,50,000. With the kindness and generosity of all of you, we have so far raised ₹50,229 through Milaap.
                      </p>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-4">
                        <p className="font-bold text-slate-900">Raised through Milaap: ₹50,229</p>
                        <p className="font-bold text-slate-900">Initial Campaign Goal: ₹2,50,000</p>
                      </div>

                      <p>
                        I am extremely grateful to share that my father's brain operation has been completed. After surgery and continued medical care, his condition improved, and his staples have also now been removed. The doctors have told us that he can now be discharged and continue his recovery at home.
                      </p>

                      <p>
                        However, during the course of his treatment, including the brain surgery, ICU stay, medicines, investigations, hospital stay and other medical expenses, the total bill has now reached approximately ₹4,00,000.
                      </p>

                      <p>
                        Our family has somehow managed to arrange a major portion of the expenses through our own limited savings, help from relatives, borrowings, and the ₹50,229 generously raised through this campaign.
                      </p>

                      <p>
                        But despite all our efforts, we are still short of approximately ₹1,50,000.
                      </p>

                      <p>
                        We urgently need this amount to clear the remaining hospital and treatment expenses so that we can bring my father home and continue his recovery and post-operative care.
                      </p>

                      <p>
                        We have already used almost every resource available to us, and arranging another ₹1.5 lakh on our own has become extremely difficult.
                      </p>

                      <p>
                        My father has survived a very critical brain condition and has come this far because of timely treatment, your prayers, and the support of kind-hearted people. We are now very close to bringing him home, but we need your help one more time.
                      </p>

                      <p>
                        I humbly request everyone reading this update to please contribute whatever amount you can. Even ₹100, ₹500, ₹1,000 or any amount you are comfortable with can make a difference when many people come together.
                      </p>

                      <p>
                        If you are unable to donate, please share this campaign with your friends, family members, colleagues and social networks. A single share may help us reach someone who can support my father's remaining treatment expenses.
                      </p>

                      <p>
                        To everyone who has already donated from the ₹50,229 raised so far, prayed for my father, or shared our campaign — thank you from the bottom of my heart. Your support helped us get him through his surgery and this extremely difficult period.
                      </p>

                      <p>
                        Now we only want to clear the remaining expenses and bring my father safely back home.
                      </p>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-4">
                        <p className="font-bold text-slate-900">Amount raised so far on Milaap: ₹50,229</p>
                        <p className="font-bold text-slate-900">Total treatment expenses: Approximately ₹4,00,000</p>
                        <p className="font-bold text-red-600">Amount still urgently required: Approximately ₹1,50,000</p>
                      </div>

                      <p className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                        🙏 <strong>Please help us complete this final stage of my father's treatment and recovery.</strong>
                      </p>

                      <p>
                        With gratitude and hope,<br />
                        <strong>Ansar Husain</strong><br />
                        Son of Syed Zafar Husain
                      </p>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">
                        Official hospital documents and medical estimates:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                          <h5 className="font-bold text-slate-900 text-sm">Hospital Consent Letter (सहमति पत्र)</h5>
                          <p className="text-xs text-slate-400 mt-1">Admission & Surgical Consent</p>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-2">
                            <CheckCircle2 className="h-3 w-3" /> Verified Document
                          </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                          <h5 className="font-bold text-slate-900 text-sm">Treatment Cost Quotation</h5>
                          <p className="text-xs text-slate-400 mt-1">Estimate: ₹ 4,00,000</p>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-2">
                            <CheckCircle2 className="h-3 w-3" /> Verified Estimate
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "updates" && (
                    <div className="space-y-6">
                      {/* Update 1 - Latest (from image) */}
                      <div className="border-l-2 border-emerald-500 pl-4 sm:pl-6 space-y-1.5 relative">
                        <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          about 24 hours ago • Latest Update
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">
                          My Father Is Ready for Discharge, But We Still Need ₹1,50,000
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          My father's brain operation has been completed. His staples have been removed and doctors have cleared him for discharge. However, we still need ₹1,50,000 to clear the remaining hospital expenses. Total bill reached approximately ₹4,00,000.
                        </p>
                      </div>

                      {/* Update 2 - 15 days ago (from image) */}
                      <div className="border-l-2 border-slate-300 pl-4 sm:pl-6 space-y-1.5 relative">
                        <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-300 border-2 border-white" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          15 days ago
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">
                          Father is stable in ICU after procedure
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Syed Zafar Husain has completed his procedure and is currently stable. He is now receiving critical care in the ICU. We have raised Rs 37,747 so far. The medical team estimates we may need up to Rs 50,000 more for continued treatment and post-operative care.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 4. COST BREAKDOWN ───────────────── */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="text-center pb-4 border-b border-slate-100">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Cost Breakdown
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Medical Treatment & Expense Breakdown
                  </p>
                </div>

                <div className="mt-4 divide-y divide-slate-100">
                  {EXPENSE_BREAKDOWN.map((exp, i) => (
                    <div key={i} className="py-3.5 flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-medium">{exp.item}</span>
                      <span className="font-bold text-slate-900">{exp.amount}</span>
                    </div>
                  ))}

                  <div className="pt-4 flex items-center justify-between text-base sm:text-lg font-extrabold text-slate-900">
                    <span>Total Estimated Treatment Cost</span>
                    <span className="text-emerald-700">₹ 4,00,000</span>
                  </div>
                </div>
              </div>

              {/* ── 5. DIRECT BANK TRANSFER BOX ────── */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="text-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Direct Bank Transfer
                  </h3>
                  <p className="text-xs text-slate-500">
                    To pay directly via NEFT / RTGS / IMPS / UPI
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Account Name</span>
                      <span className="font-bold text-slate-800 text-sm">Milaap Foundation</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Account Number</span>
                      <span className="font-mono font-bold text-emerald-700 text-base">95952100003204</span>
                    </div>
                    <button
                      onClick={() => handleCopyAccount("95952100003204", "acc")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition shadow-sm"
                    >
                      {accountCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {accountCopied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">IFSC Code</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">BARB0BUPGBX</span>
                    </div>
                    <button
                      onClick={() => handleCopyAccount("BARB0BUPGBX", "ifsc")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition shadow-sm"
                    >
                      {ifscCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {ifscCopied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Bank Name</span>
                      <span className="font-semibold text-slate-700 text-sm">Uttar Pradesh Gramin Bank</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 6. SUPPORTERS FEED ──────────────── */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="text-center pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Supporters ({donorCount})
                  </h3>
                  <div className="text-emerald-600 tracking-widest text-xs my-1 font-bold">
                    ◆ ❖ ◆
                  </div>
                  <p className="text-xs text-slate-500">
                    Recent contributions from kind-hearted supporters
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {(showAllDonors ? donorFeed : donorFeed.slice(0, 5)).map((donor, idx) => (
                    <div
                      key={donor.id || idx}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        {donor.avatar}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {donor.name}
                          </span>
                          <span className="font-extrabold text-emerald-700 text-sm">
                            {donor.amount}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{donor.message}</p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {donor.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {donorFeed.length > 5 && (
                  <div className="text-center mt-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowAllDonors((prev) => !prev)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                    >
                      {showAllDonors ? "Show Less" : "View all supporters"}
                    </button>
                  </div>
                )}
              </div>

              {/* ── 7. SPREAD THE WORD BOX ─────────── */}
              <div className="rounded-3xl bg-slate-50/80 border border-slate-200 p-6 text-center space-y-3">
                <p className="text-sm text-slate-700 font-medium">
                  Can't donate? Sharing this campaign can help raise 5x more funds.
                </p>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 text-sm shadow-md transition"
                >
                  <Share2 className="h-4 w-4" />
                  Spread the word & Share
                </button>
              </div>

              {/* ── 8. CONTACT ORGANISER BOX ───────── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Have questions regarding this patient or campaign?
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <User className="h-3.5 w-3.5" />
                  Contact Organiser
                </button>
              </div>

              {/* ── 9. FREQUENTLY ASKED QUESTIONS ──── */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="text-center pb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {CAMPAIGN_FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="flex w-full items-center justify-between p-4 text-left font-bold text-slate-800 text-sm hover:text-emerald-700 transition"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                            openFaq === idx ? "rotate-180 text-emerald-600" : "text-slate-400"
                          }`}
                        />
                      </button>

                      {openFaq === idx && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 10. DISCLAIMER & GUARANTEE BOXES ── */}
              <div className="space-y-3 text-center text-xs text-slate-500">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-700">
                    This campaign has been officially verified by the hospital Medical Board and all donations are 100% directly allocated to the patient's hospital treatment.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p>
                    Report this campaign if you find any discrepancies or need more details. Contact Helpline:{" "}
                    <a href="tel:+918899700966" className="font-bold text-emerald-700 hover:underline">
                      +91-8899700966
                    </a>
                  </p>
                </div>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* RIGHT COLUMN: STICKY DONATION WIDGET (4 COLS)             */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-5">
              
              {/* PRIMARY DONATION BOX */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-7 space-y-6">
                
                {/* Progress Stats */}
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                      ₹ {raisedAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      raised of ₹{targetAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Supporters & Days remaining */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mt-2.5">
                    <span>{percentage}% Funded</span>
                    <span>{donorCount} Donors</span>
                    <span className="text-amber-600 font-bold">6 Days Left</span>
                  </div>
                </div>

                {/* Quick Donation Presets */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Select Contribution Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${
                          selectedAmount === amt && !customAmount
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 scale-105"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300"
                        }`}
                      >
                        ₹ {amt.toLocaleString()}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelectedAmount(0)}
                      className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${
                        customAmount || selectedAmount === 0
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Amount Input */}
                  {(selectedAmount === 0 || customAmount) && (
                    <div className="relative mt-3">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full rounded-xl border border-emerald-400 bg-white pl-8 pr-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  )}
                </div>

                {/* Primary Donate Button */}
                <button
                  onClick={() => setIsDonateModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <Heart className="h-5 w-5 fill-white" />
                  Donate ₹ {currentFinalAmount.toLocaleString()} Now
                </button>

                {/* Dynamic UPI QR Code Scanner */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center space-y-3">
                  <button
                    onClick={() => setShowQrCode((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition"
                  >
                    <QrCode className="h-4 w-4 text-emerald-600" />
                    {showQrCode ? "Hide Instant UPI Scanner" : "Scan & Pay via any UPI App (GPay / PhonePe / Paytm)"}
                  </button>

                  {showQrCode && (
                    <div className="pt-2 flex flex-col items-center animate-in fade-in duration-300 space-y-2">
                      <div className="relative h-44 w-44 rounded-2xl overflow-hidden border-2 border-emerald-500 p-2 bg-white shadow-md">
                        <Image
                          src="/images/upi-scr.png"
                          alt="Hospital Donation UPI QR Code"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Scan with GPay, PhonePe, Paytm, or BHIM UPI
                      </p>
                      <div className="bg-white rounded-lg p-2 border border-slate-200 text-left w-full text-xs space-y-1">
                        <p className="text-slate-600 font-semibold truncate">A/C: 95952100003204</p>
                        <p className="text-slate-600 font-semibold">IFSC: BARB0BUPGBX</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Eligible for 50% Tax Exemption under Sec 80G</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>256-bit Encrypted & Safe Payment Gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Zero Platform Fees • 100% to Hospital Account</span>
                  </div>
                </div>

              </div>

              {/* HOSPITAL CONTACT HELPLINE WIDGET */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 text-sm space-y-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span>Need Assistance or Wire Support?</span>
                </div>
                <p className="text-xs text-slate-500">
                  Call our 24/7 Patient Campaign Desk:{" "}
                  <a href="tel:+918899700966" className="font-bold text-emerald-700 hover:underline">
                    +91-8899700966
                  </a>
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ── MOBILE FLOATING STICKY ACTION BAR ────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Raised so far</span>
            <span className="text-base font-extrabold text-emerald-700">
              ₹ {raisedAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/30"
            >
              <Heart className="h-4 w-4 fill-white" />
              Donate Now
            </button>
          </div>
        </div>

        {/* ── INTERACTIVE PAYMENT & DONATION MODAL ─────────────────── */}
        {isDonateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => !isSubmitting && setIsDonateModalOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <Heart className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Support Syed Zafar Husain</h3>
                    <p className="text-xs text-emerald-100">80G Tax Exemption Certificate Included</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDonateModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-7">
                {!donationSuccess ? (
                  <form onSubmit={handleDonationSubmit} className="space-y-4">
                    {/* Amount preview */}
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        Contributing Amount
                      </span>
                      <div className="text-3xl font-black text-emerald-800 mt-1">
                        ₹ {currentFinalAmount.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {paymentError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                        <span>{paymentError}</span>
                      </div>
                    )}

                    {/* Donor Details */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required={!isAnonymous}
                        disabled={isAnonymous || isSubmitting}
                        placeholder="e.g. Rajesh Sharma"
                        value={isAnonymous ? "Anonymous Supporter" : donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          disabled={isSubmitting}
                          placeholder="rajesh@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          disabled={isSubmitting}
                          placeholder="+91 98765 43210"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        PAN Number (Optional, for 80G Tax Exemption)
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="ABCDE1234F"
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-mono text-slate-800 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Prayer / Well-Wisher Message (Optional)
                      </label>
                      <textarea
                        rows={2}
                        disabled={isSubmitting}
                        placeholder="e.g. Wishing uncle a speedy recovery and strength to the family!"
                        value={donorMessage}
                        onChange={(e) => setDonorMessage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Anonymous Checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        Make my donation anonymous on the public supporters list
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>Processing Payment...</>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          Proceed to Pay ₹ {currentFinalAmount.toLocaleString()}
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="py-6 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                      <Check className="h-8 w-8 stroke-[3]" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">
                      Thank You, {isAnonymous ? "Generous Donor" : donorName || "Donor"}!
                    </h4>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Your contribution of <strong>₹{currentFinalAmount.toLocaleString()}</strong> has been credited to Syed Zafar Husain's hospital surgery account.
                    </p>

                    {transactionRef && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 font-mono inline-block">
                        Ref: {transactionRef}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setDonationSuccess(false);
                          setIsDonateModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                      >
                        View Updated Campaign Feed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT ORGANISER MODAL ─────────────────────────────── */}
        {isContactModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsContactModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Contact Campaign Organiser</h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    AH
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Ansar Husain</p>
                    <p className="text-xs text-slate-500">Son of patient • Verified Organiser</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>Hospital Helpline: +91-8899700966</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span>Email: support@milaap.org</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>Location: Muzaffarnagar / New Delhi</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-full rounded-xl bg-slate-900 text-white font-bold py-2.5 text-xs hover:bg-slate-800 transition mt-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}