"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
export default function DonationSection() {
  const slides = [
    "/images/home/hero_image_2.webp",
    "/images/home/hero_image_3.jpg",
    "/images/home/hero_image_4.png",
  ];
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 to-emerald-100">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full"></div>

      <div className="max-w-[90%] lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto px-4 relative z-10">
        {/* HERO */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Make a <span className="text-emerald-600">Real Impact</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Your contribution directly supports life-saving healthcare services.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Contribution Changes Lives
            </h2>

            <div className="space-y-6">
              {[
                "Advanced medical equipment funding",
                "Free treatments for underprivileged patients",
                "Medical research & innovation support",
                "Scholarships for healthcare students",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-emerald-500 p-2 rounded-full mt-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-600 mt-8 text-lg">
              Every rupee creates a measurable impact in healthcare delivery.
            </p>
          </div>

          {/* 🔥 RIGHT IMAGE PANEL */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl group">
            {/* Image */}
            <Image
              src="/images/home/about_1.jpg"
              alt="Donation Impact"
              fill
              className="object-cover group-hover:scale-105 transition duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Help Save Lives Today</h3>
              <p className="text-sm opacity-90 mb-4 max-w-md">
                Your support ensures access to quality healthcare for those who
                need it most.
              </p>
              <Link href="/donate" className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-semibold transition">
                Donate Now
              </Link>
            </div>
          </div>
        </div>

        {/* 🔥 BOTTOM CAROUSEL */}
        <div className="mx-auto mt-12 rounded-3xl overflow-hidden relative w-full h-[240px] md:h-[280px] lg:h-[300px]">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {slides.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Healthcare Banner ${index}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
