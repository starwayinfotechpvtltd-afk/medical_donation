"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

export default function HomeServicesSection() {
const services = [
  {
    title: "General Medicine",
    img: "/images/services/1.webp",
  },
  {
    title: "Cardiology",
    img: "/images/services/2.webp",
  },
  {
    title: "Neurology",
    img: "/images/services/3.webp",
  },
  {
    title: "Orthopedics",
    img: "/images/services/4.webp",
  },
  {
    title: "Pediatrics",
    img: "/images/services/5.webp",
  },
  {
    title: "Gynecology & Obstetrics",
    img: "/images/services/6.webp",
  },
  {
    title: "Nephrology",
    img: "/images/services/7.webp",
  },
  {
    title: "Urology",
    img: "/images/services/8.webp",
  },
  {
    title: "Oncology",
    img: "/images/services/9.webp",
  },
  {
    title: "Dermatology",
    img: "/images/services/10.webp",
  },
  {
    title: "ENT",
    img: "/images/services/11.webp",
  },
  {
    title: "Emergency & Trauma Care",
    img: "/images/services/12.webp",
  },
];

  return (
    <section className="w-full py-16 bg-green-100/50 overflow-hidden">
      <div className="max-w-[90%] lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Our Services
          </h2>

          <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
            Precision-driven care. Minimal process. Exceptional outcomes.
          </p>
        </motion.div>

        {/* External Navigation Arrows */}
        <div className="absolute -top-4 right-0 flex gap-4 z-10">
          <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-900 hover:text-white transition">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-900 hover:text-white transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4 },
            }}
          >
            {services.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="group"
                >
                  <div className="rounded-3xl overflow-hidden bg-gray-200 p-4">

                    {/* Image */}
                    <div className="relative w-full h-72 overflow-hidden rounded-2xl">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Minimal Content */}
                    <div className="py-6 text-center">
                      <h3 className="text-lg font-medium text-gray-900 tracking-tight">
                        {item.title}
                      </h3>
                    </div>

                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

      </div>
    </section>
  );
}