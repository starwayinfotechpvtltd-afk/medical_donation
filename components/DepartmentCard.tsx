// components\DepartmentCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Stethoscope, Bed } from "lucide-react";

interface DepartmentService {
  id?: number;
  service_name: string;
}

interface Department {
  id: string | number;
  name: string;
  description?: string | null;
  icon?: string | null;
  image?: string;
  image_url?: string | null;
  doctors?: number;
  beds?: number | null;
  services?: Array<string | DepartmentService>;
}

interface DepartmentCardProps {
  department: Department;
  showDetails?: boolean;
}

export function DepartmentCard({
  department,
  showDetails = false,
}: DepartmentCardProps) {
  const services = (department.services ?? [])
    .map((service) =>
      typeof service === "string"
        ? service
        : service.service_name
    )
    .filter(Boolean);

  const imageSrc =
    department.image_url ||
    department.image ||
    "/images/home/hero_image_2.webp";

  const doctorCount =
    typeof department.doctors === "number"
      ? department.doctors
      : 0;

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#E6F4EE]">
        <Image
          src={imageSrc}
          alt={department.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 bg-[#E6F4EE] p-6">

        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {department.name}
          </h3>
        </div>

        {/* Description */}
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {department.description ||
            "Comprehensive care with advanced medical facilities."}
        </p>

        {/* Doctors & Beds */}
        <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-2">
            <Stethoscope
              size={16}
              className="text-emerald-600"
            />
            {doctorCount}{" "}
            {doctorCount === 1 ? "Doctor" : "Doctors"}
          </span>

          <span className="flex items-center gap-2">
            <Bed
              size={16}
              className="text-emerald-600"
            />
            {department.beds ?? "-"} Beds
          </span>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {services.map((service, index) => (
              <span
                key={index}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
              >
                {service}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/departments/${department.id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}