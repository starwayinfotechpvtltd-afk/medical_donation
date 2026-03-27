import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[70%] mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-md text-sm font-semibold mb-4">
            Testimonials
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug max-w-2xl mx-auto">
            Outstanding Care Backed by Patient <br /> Reviews
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT REVIEW CARD */}
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100 shadow-sm">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-800 font-semibold leading-relaxed text-sm md:text-[15px]">
              Discover authentic patient stories showcasing our expert medical
              care, personalized treatments, and compassionate support. See how
              our dedicated.
            </p>

            {/* Divider */}
            <div className="my-6 h-[1px] w-full bg-green-200"></div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-green-200">
                <Image
                  src="/images/user.jpg"
                  alt="User"
                  width={44}
                  height={44}
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="text-gray-900 font-bold text-sm">
                  Ms. Anjelina Watson
                </h4>
                <p className="text-gray-500 text-xs">Health</p>
              </div>
            </div>
          </div>

          {/* RIGHT STATS GRID */}
          <div className="grid grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-green-600 rounded-2xl p-7 text-center shadow-md">
              <h3 className="text-white font-extrabold text-3xl">82%</h3>
              <p className="text-white/90 text-sm mt-2">Patient Experience</p>
            </div>

            {/* Card 2 */}
            <div className="bg-green-600 rounded-2xl p-7 text-center shadow-md">
              <h3 className="text-white font-extrabold text-3xl">96%</h3>
              <p className="text-white/90 text-sm mt-2">Patient Experience</p>
            </div>

            {/* Wide Card */}
            <div className="col-span-2 bg-green-600 rounded-2xl p-7 flex items-center justify-between shadow-md">
              <div>
                <p className="text-white/90 text-sm font-medium">
                  Our Client Rate Us
                </p>
                <h3 className="text-white font-extrabold text-3xl mt-1">8.9</h3>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-white fill-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
