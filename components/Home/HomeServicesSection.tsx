// import Image from "next/image";
// import React from "react";
// import { Stethoscope, ArrowUpRight } from "lucide-react";

// export default function HomeServicesSection() {
//   const services = [
//     {
//       title: "Advanced Diagnostics",
//       desc: "Precise and modern diagnostic solutions ensuring early detection and accurate treatment planning.",
//       img: "/images/home/about_2.webp",
//     },
//     {
//       title: "Dental Implants",
//       desc: "State-of-the-art implant procedures designed to restore confidence and functionality.",
//       img: "/images/home/about_2.webp",
//     },
//     {
//       title: "Teeth Whitening",
//       desc: "Professional whitening treatments delivering brighter smiles safely and effectively.",
//       img: "/images/home/about_2.webp",
//     },
//     {
//       title: "Cosmetic Dentistry",
//       desc: "Enhancing smiles with aesthetic precision and personalized care solutions.",
//       img: "/images/home/about_2.webp",
//     },
//   ];

//   return (
//     <section className="relative w-full py-24 bg-gradient-to-b from-white to-green-50">
//       <div className="max-w-[70%] mx-auto">
        
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <span className="inline-block px-4 py-1.5 text-sm font-semibold tracking-wide text-green-700 bg-green-100 rounded-full">
//             Our Services
//           </span>

//           <h2 className="mt-6 text-4xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
//             Modern Healthcare Solutions Designed<br />
//             <span className="text-green-600"> Around You</span>
//           </h2>

//           <p className="mt-5 text-gray-600 mx-auto text-base md:text-lg">
//             Delivering innovative medical and dental treatments with a patient-first approach and cutting-edge technology.
//           </p>
//         </div>

//         {/* Services Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {services.map((item, index) => (
//             <div
//               key={index}
//               className="group relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
//             >
//               {/* Image */}
//               <div className="relative w-full h-56 overflow-hidden">
//                 <Image
//                   src={item.img}
//                   alt={item.title}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
//               </div>

//               {/* Content */}
//               <div className="pt-10 pb-8 px-6">
//                 <h4 className="text-lg font-bold text-gray-900 mb-3">
//                   {item.title}
//                 </h4>

//                 <p className="text-gray-600 text-sm leading-relaxed mb-6">
//                   {item.desc}
//                 </p>

//                 <button className="flex items-center gap-2 text-sm font-semibold text-green-600 group-hover:text-green-700 transition">
//                   Learn More
//                   <ArrowUpRight
//                     size={16}
//                     className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                   />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }





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
      title: "Advanced Diagnostics",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Dental Implants",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Teeth Whitening",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Cosmetic Dentistry",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Root Canal Therapy",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Orthodontics",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Pediatric Dentistry",
      img: "/images/home/about_2.webp",
    },
    {
      title: "Oral Surgery",
      img: "/images/home/about_2.webp",
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