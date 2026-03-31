"use client";

import Image from "next/image";
import { PhoneCall, ShieldCheck, Stethoscope, HeartPulse, HeartPlus, ClockPlus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

export default function HeroSection() {

    const slides = [
    "/images/home/hero_image_2.webp",
    "/images/home/hero_image_3.jpg",
    "/images/home/hero_image_4.png",
  ];
  return (
    <section className="w-full bg-gradient-to-b from-green-50 via-white to-white">
      {/* Hero Content */}
      <div className="w-full lg:px-0 py-12 lg:py-16">
        <div className="max-w-[75%] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="flex-1">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
              <ShieldCheck size={18} className="text-green-700" />
              <p className="text-green-800 font-semibold text-sm">
                Trusted by 10,000+ Patients Worldwide
              </p>
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              All-Inclusive <span className="text-green-600">Healthcare</span>
              Center
            </h1>

            <p className="mt-5 text-gray-600 text-[15px] md:text-[16px] leading-relaxed max-w-xl">
              Your trusted medical partner for modern treatment, expert doctors,
              advanced diagnostics, and personalized care to help you live a
              healthier, stronger life.
            </p>

            {/* Features Row */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <HeartPulse size={18} className="text-green-700" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">
                  Emergency Care 24/7
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope size={18} className="text-green-700" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">
                  Certified Doctors Team
                </p>
              </div>
            </div>

            {/* CTA Row */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <button className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-semibold text-sm transition shadow-md">
                Book Appointment
              </button>

              {/* Call Button */}
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-green-200 bg-white hover:bg-green-50 text-green-700 font-semibold text-sm transition">
                <PhoneCall size={18} />
                Call Now
              </button>
            </div>
          </div>

          {/* Right Side Badge */}
          <div className="w-full lg:w-[360px]">
            <div className="flex flex-col gap-5 rounded-3xl p-7 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative overflow-hidden">
              
              {/* Green Glow */}
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-green-400/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-600/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Top */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold"><HeartPlus /></span>
                  </div>

                  <div>
                    <h4 className="text-gray-900 font-bold text-2xl">
                      Quality Service
                    </h4>
                    <p className="text-gray-600 text-sm leading-snug">
                      Trusted by patients worldwide
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                    <p className="text-gray-600 text-xs font-medium">
                      Doctors Available
                    </p>
                    <h3 className="text-gray-900 font-extrabold text-2xl">
                      24/7
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                    <p className="text-gray-600 text-xs font-medium">
                      Success Rate
                    </p>
                    <h3 className="text-gray-900 font-extrabold text-2xl">
                      98%
                    </h3>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="mt-5 flex items-center justify-between bg-green-600 text-white px-5 py-4 rounded-2xl shadow-[0_12px_30px_rgba(16,185,129,0.45)]">
                  <div>
                    <p className="text-xs opacity-90">Fast Appointment</p>
                    <h4 className="font-semibold text-lg">Book in 2 Minutes</h4>
                  </div>

                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold">
                    <span><ClockPlus /></span>
                  </div>
                </div>

                {/* Small Note */}
                <p className="mt-4 text-xs text-gray-500 text-center">
                  No long waiting time • Quick diagnosis • Affordable pricing
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Hero Image Banner */}
        {/* <div className="max-w-[80%] mx-auto mt-12 rounded-3xl overflow-hidden shadow-xl border border-gray-200 relative w-full h-[260px] md:h-[340px] lg:h-[400px]">
          <Image
            src="/images/home/hero_image_2.webp"
            alt="Healthcare Banner"
            fill
            className="object-cover"
            priority
          />
        </div> */}

        <div className="max-w-[75%] mx-auto mt-12 rounded-3xl overflow-hidden border-2 border-green-500 relative w-full h-[260px] md:h-[340px] lg:h-[400px]">
      
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
