import Image from "next/image";
import React from "react";
import { CheckCircle } from "lucide-react";

export default function HomeAboutSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[70%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE */}
        <div>
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-md text-sm font-semibold mb-4">
            About Us
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Advanced medical <br /> care with compassion
          </h2>

          {/* Image */}
          <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-200 relative w-full h-[280px] md:h-[330px]">
            <Image
              src="/images/home/about_2.webp"
              alt="Doctor Checking Patient"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          
          {/* Top Image */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 relative w-full h-[180px] md:h-[200px]">
            <Image
              src="/images/home/about_1.jpg"
              alt="Doctors Consultation"
              fill
              className="object-cover"
            />
          </div>

          {/* Content Row */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Features List */}
            <div className="flex-1">
              <ul className="space-y-3 text-gray-700 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Experienced Team
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  State-of The Digital Technology
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Emergency Healthcare Services
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  24/7 Emergency Supported Team
                </li>
              </ul>

              {/* Button */}
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition">
                More About Us
              </button>
            </div>

            {/* Experience Card */}
            <div className="w-full md:w-[190px] bg-green-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">✓</span>
              </div>

              <h3 className="text-white text-3xl font-extrabold">15+</h3>
              <p className="text-white/90 text-sm mt-1">
                Years Of Medical Experience
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
