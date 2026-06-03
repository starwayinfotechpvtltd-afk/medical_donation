"use client";

import Image from "next/image";
import { Stethoscope, Bed } from "lucide-react";

interface Department {
  id: string | number;
  name: string;
  description?: string | null;
  image?: string;
  image_url?: string | null;
  doctors?: number;
  beds?: number | null;
  services?: Array<string | { id?: number; service_name: string }>;
}

interface Props {
  department: Department;
}

export default function DepartmentCard({ department }: Props) {
  const services = (department.services ?? [])
    .map((s) => (typeof s === "string" ? s : s.service_name))
    .filter(Boolean);

  const imageSrc = department.image_url || department.image || "/images/home/hero_image_2.webp";
  const doctorCount = typeof department.doctors === "number" ? department.doctors : 0;
  const doctorLabel = `${doctorCount} ${doctorCount === 1 ? "Doctor" : "Doctors"}`;

  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="relative w-full aspect-[16/9] shrink-0 overflow-hidden bg-[#E6F4EE]">
        <Image
          src={imageSrc}
          alt={department.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-1 bg-[#E6F4EE] p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug mb-2">
          {department.name}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {department.description || "Comprehensive care with advanced medical facilities."}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
          <span className="flex items-center gap-1.5">
            <Stethoscope size={16} className="text-emerald-600 shrink-0" />
            {doctorLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Bed size={16} className="text-emerald-600 shrink-0" />
            {department.beds ?? "-"} Beds
          </span>
        </div>

        {services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {services.slice(0, 4).map((service, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 bg-white text-gray-600 rounded-full border border-gray-200 whitespace-nowrap"
              >
                {service}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
