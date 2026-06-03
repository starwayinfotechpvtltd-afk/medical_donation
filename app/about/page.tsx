import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { hospitalInfo } from "@/data/hospital";
import {
  Heart,
  Eye,
  Shield,
  Lightbulb,
  Users,
  Star,
  Award,
  ArrowRight,
  Quote,
  Hospital,
  Stethoscope,
  Ambulance,
  Pill,
  HeartHandshake,
  FileText,
} from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "About Us - About Mefigure Siddhi Vadanta Foundation Hospital",
  description:
    "Learn about our hospital's history, mission, vision, and leadership team.",
};

const coreValues = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "We prioritize the well-being and comfort of our patients in every decision we make.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We strive for the highest standards in medical practice and service delivery.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We operate with transparency, honesty, and ethical principles at all times.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Heart,
    title: "Compassion",
    description:
      "We treat every patient and their family with genuine empathy and deep respect.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace new technologies and methods to continuously improve healthcare outcomes.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Users,
    title: "Teamwork",
    description:
      "We collaborate as a unified team to provide comprehensive, seamless care.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
];

const stats = [
  { number: "2+", label: "Years of Service", sub: "Trusted since 2023" },
  {
    number: "20K+",
    label: "Patients Annually",
    sub: "Lives touched every year",
  },
  { number: "10+", label: "Departments", sub: "Specialised care units" },
  { number: "150+", label: "Hospital Staff", sub: "Dedicated professionals" },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <PageHero
          badge="About Our Hospital"
          icon={HeartHandshake}
          title="Healing with purpose every single day."
          description="Dedicated to providing compassionate, high-quality healthcare services to our community for over eighteen years."
          breadcrumb={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "About Us",
            },
          ]}
        />

        {/* ── OUR STORY ────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_2px_1fr] gap-12 items-start">
              {/* Left */}
              <div className="space-y-6">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                  Our Story
                </span>
                <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                  A legacy of care built on trust
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {hospitalInfo.history}
                </p>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent self-stretch" />

              {/* Right */}
              <div className="space-y-8 pt-2">
                <p className="text-slate-600 text-lg leading-relaxed">
                  Today, we continue to be a beacon of hope and healing, serving
                  thousands of patients annually with dedication, expertise, and
                  genuine compassion.
                </p>
                {/* Pull-stat trio */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  {[
                    { n: "2+", l: "Years" },
                    { n: "20K+", l: "Patients" },
                    { n: "150+", l: "Staff" },
                  ].map(({ n, l }) => (
                    <div key={l}>
                      <p className="text-3xl font-bold text-emerald-600">{n}</p>
                      <p className="text-sm text-slate-500 mt-1">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ─────────────────────────────────── */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-50/60 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Mission &amp; Vision
              </span>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                What drives us forward
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Mission */}
              <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-3xl" />
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {hospitalInfo.mission}
                </p>
              </div>

              {/* Vision */}
              <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-3xl" />
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Our Vision
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {hospitalInfo.vision}
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">
                  Core Values
                </h3>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  6 Principles
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreValues.map(
                  ({ icon: Icon, title, description, color, bg, border }) => (
                    <div
                      key={title}
                      className={`flex gap-4 rounded-2xl border p-5 ${bg} ${border} transition-transform hover:-translate-y-0.5`}
                    >
                      <div className={`mt-0.5 shrink-0 ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm mb-1">
                          {title}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── DIRECTOR & CEO MESSAGES ────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600">
                Leadership
              </span>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight mt-2">
                Words from our leadership
              </h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                Our dedicated leaders share their vision and commitment to
                excellence in healthcare
              </p>
            </div>

            <div className="space-y-24">
              {/* ── CEO'S SECTION ──────────────────────────────────── */}
              <div className="group">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                  {/* Message side - LEFT */}
                  <div className="space-y-6 lg:order-1">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600">
                      Founder & Director's Message
                    </span>
                    <div className="relative pl-6 border-l-2 border-blue-400 py-1">
                      <Quote className="absolute -left-3 -top-1 h-5 w-5 text-blue-400 bg-white" />
                      <div className="space-y-4">
                        <p className="text-slate-600 text-lg leading-relaxed italic">
                          "When I founded Advanced Medical Care Hospital, my
                          vision was clear: to create a healthcare institution
                          that would set new benchmarks for quality, compassion,
                          and innovation. Today, seeing that vision come to life
                          fills me with immense pride and gratitude."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "Healthcare is not merely a service — it's a sacred
                          trust. Every patient who walks through our doors
                          places their faith in us, and we honor that trust by
                          delivering nothing less than exceptional care. Our
                          team understands that behind every medical chart is a
                          human being, a family, a story."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "We've invested heavily in cutting-edge technology,
                          continuing education for our staff, and creating a
                          healing environment that promotes recovery and
                          well-being. But our true strength lies in our people —
                          their dedication, empathy, and unwavering commitment
                          to excellence."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "Looking forward, we're expanding our services,
                          forging international partnerships, and launching
                          community health initiatives that will reach thousands
                          more families. The journey has just begun, and I
                          invite you to be part of our growing family."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "Thank you for choosing us as your healthcare partner.
                          Together, we're building a healthier, happier
                          tomorrow."
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-blue-200">
                        <Image
                          src="/Founder.webp"
                          alt="Suman"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Suman</p>
                        <p className="text-sm text-slate-500">
                          Founder & Director
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image side - RIGHT */}
                  <div className="relative flex justify-center lg:order-2">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-100 to-emerald-100 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-80 md:w-96 h-[520px] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/Founder.webp"
                        alt="Suman"
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6">
                        <p className="text-white font-bold text-xl">Suman</p>
                        <p className="text-slate-300 text-sm">
                          Founder & Director
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── DIRECTOR'S SECTION ────────────────────────────── */}
              <div className="group">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                  {/* Image side - LEFT */}
                  <div className="relative flex justify-center">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-80 md:w-96 h-[520px] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/Director.webp"
                        alt={hospitalInfo.directorName}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6">
                        <p className="text-white font-bold text-xl">
                          {hospitalInfo.directorName}
                        </p>
                        <p className="text-slate-300 text-sm">
                          Director
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message side - RIGHT */}
                  <div className="space-y-6">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600">
                      Director's Message
                    </span>
                    <div className="relative pl-6 border-l-2 border-emerald-400 py-1">
                      <Quote className="absolute -left-3 -top-1 h-5 w-5 text-emerald-400 bg-white" />
                      <div className="space-y-4">
                        <p className="text-slate-600 text-lg leading-relaxed italic">
                          {hospitalInfo.directorMessage}
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "Throughout my medical career spanning over two
                          decades, I've remained guided by a simple yet profound
                          belief: every patient deserves to be treated with the
                          same care, respect, and attention that we would want
                          for our own loved ones. This philosophy has shaped
                          every decision we've made at Advanced Medical Care
                          Hospital."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "I'm immensely proud of the team we've built — a group
                          of dedicated physicians, nurses, and healthcare
                          professionals who go above and beyond daily. Their
                          expertise, combined with our state-of-the-art
                          facilities, ensures that patients receive nothing
                          short of excellence in medical care."
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                          "From routine checkups to complex surgical procedures,
                          we maintain unwavering standards of quality and
                          safety. My commitment to you is simple: we will
                          listen, we will care, and we will do everything in our
                          power to restore your health and peace of mind."
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-emerald-200">
                        <Image
                          src="/Director.webp"
                          alt={hospitalInfo.directorName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {hospitalInfo.directorName}
                        </p>
                        <p className="text-sm text-slate-500">Director</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATISTICS ───────────────────────────────────────── */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          {/* Decorative grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Glows */}
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute top-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                By the numbers
              </span>
              <h2 className="text-4xl font-bold text-white">
                Our impact in numbers
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(({ number, label, sub }) => (
                <div
                  key={label}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/40 transition-all"
                >
                  <p className="text-5xl font-bold bg-gradient-to-br from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {number}
                  </p>
                  <p className="text-white font-semibold mb-1">{label}</p>
                  <p className="text-slate-500 text-xs">{sub}</p>
                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-400/40 group-hover:bg-emerald-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle decorative blob */}
          <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
                  Why Choose Us
                </span>
                <h2 className="text-4xl font-bold text-slate-900 leading-tight max-w-md">
                  The reasons patients{" "}
                  <span className="text-emerald-600">trust us</span> most
                </h2>
              </div>
              <p className="text-slate-500 text-base leading-relaxed max-w-sm lg:text-right">
                From cutting-edge technology to a deeply human approach — here's
                what sets our hospital apart.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Hospital,
                  title: "State-of-the-Art Facilities",
                  desc: "Our hospital is equipped with the latest diagnostic and surgical technology to ensure the most accurate and effective treatment for every patient.",
                  accent: "from-emerald-400 to-emerald-600",
                  light: "bg-emerald-50",
                },
                {
                  icon: Stethoscope,
                  title: "Expert Specialists",
                  desc: "Our team comprises board-certified specialists across multiple departments, bringing years of clinical experience and advanced medical expertise.",
                  accent: "from-blue-400 to-blue-600",
                  light: "bg-blue-50",
                },
                {
                  icon: Ambulance,
                  title: "24 / 7 Emergency Care",
                  desc: "Emergencies don't wait — neither do we. Our emergency unit operates around the clock with rapid-response teams always on standby.",
                  accent: "from-emerald-400 to-blue-500",
                  light: "bg-emerald-50",
                },
                {
                  icon: Pill,
                  title: "Integrated Pharmacy",
                  desc: "An in-house pharmacy ensures quick access to medications, with pharmacists working closely alongside your healthcare providers.",
                  accent: "from-blue-400 to-emerald-500",
                  light: "bg-blue-50",
                },
                {
                  icon: HeartHandshake,
                  title: "Patient Support Programme",
                  desc: "From admission to recovery, our patient care team provides guidance, support, and coordination throughout your healthcare journey.",
                  accent: "from-emerald-400 to-emerald-600",
                  light: "bg-emerald-50",
                },
                {
                  icon: FileText,
                  title: "Digital Health Records",
                  desc: "Securely access your medical history, prescriptions, reports, and test results anytime through our digital healthcare platform.",
                  accent: "from-blue-400 to-blue-600",
                  light: "bg-blue-50",
                },
              ].map(({ icon: Icon, title, desc, accent, light }) => (
                <div
                  key={title}
                  className="group relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Top gradient bar */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${light} text-2xl mb-5`}
                  >
                    <Icon
                      className="h-6 w-6 text-emerald-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA strip */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10">
              {/* Dot grid overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />

              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xl font-bold text-white mb-1">
                    Ready to experience exceptional care?
                  </p>
                  <p className="text-slate-400 text-sm">
                    Book an appointment today — our team is here to help you
                    every step of the way.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <a
                    href="/appointment"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
                  >
                    Book Appointment <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
