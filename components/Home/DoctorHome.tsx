"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

/* ❗ Move these to global.css if TS error */
// import "swiper/css";
// import "swiper/css/pagination";

/* ---------------- DATA ---------------- */
const featuredDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    experience: "15+ years",
    rating: 4.9,
    education: "MD - Harvard",
    availability: "Mon, Wed, Fri",
    image: "/images/home/about_2.webp",
    bio: "Expert in preventive cardiology.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    experience: "12+ years",
    rating: 4.8,
    education: "MD - Johns Hopkins",
    availability: "Tue, Thu",
    image: "/images/home/about_2.webp",
    bio: "Specialist in neurological disorders.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    experience: "10+ years",
    rating: 4.9,
    education: "MD - Stanford",
    availability: "Mon-Fri",
    image: "/images/home/about_2.webp",
    bio: "Dedicated to children's health.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedic",
    experience: "18+ years",
    rating: 4.7,
    education: "MD - Mayo Clinic",
    availability: "Mon, Wed",
    image: "/images/home/about_2.webp",
    bio: "Joint replacement specialist.",
  },
];

/* ---------------- CARD ---------------- */
function DoctorCard({ doctor }: any) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">

      <div className="relative h-[220px]">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover"
        />

        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {doctor.rating}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg">{doctor.name}</h3>
        <p className="text-green-600 text-sm">{doctor.specialty}</p>
        <p className="text-gray-500 text-sm">{doctor.experience}</p>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {doctor.bio}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          {doctor.education}
        </p>

        <div className="flex justify-between mt-4">
          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
            {doctor.availability}
          </span>

          <button className="text-green-600 text-sm font-semibold">
            Book →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export default function DoctorsSection() {
  const isCarousel = featuredDoctors.length > 3;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Meet Our Doctors
          </h2>
          <p className="text-gray-600 mt-2">
            Trusted professionals for your healthcare needs
          </p>
        </div>

        {/* CONDITION */}
        {isCarousel ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {featuredDoctors.map((doctor) => (
              <SwiperSlide key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/doctors"
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            View All Doctors
          </Link>
        </div>

      </div>
    </section>
  );
}