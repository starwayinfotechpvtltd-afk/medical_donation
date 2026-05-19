import Image from "next/image";
import Link from "next/link";
import { type Department } from "@/data/departments";

interface DepartmentCardProps {
  department: Department;
  showDetails?: boolean;
}

export function DepartmentCard({ department, showDetails = false }: DepartmentCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-105">
      <div className="relative h-48 bg-slate-200">
        <Image
          src={department.image}
          alt={department.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl">{department.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{department.name}</h3>
          </div>
        </div>

        {/* trying fixed */}

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{department.description}</p>

        {showDetails && (
          <div className="mb-4 pb-4 border-b border-slate-200 space-y-2">
            <p className="text-slate-700 text-sm">
              <span className="font-semibold">Doctors:</span> {department.doctors}
            </p>
            <p className="text-slate-700 text-sm">
              <span className="font-semibold">Beds:</span> {department.beds}
            </p>
            <div>
              <p className="text-slate-700 text-sm font-semibold mb-2">Services:</p>
              <ul className="text-slate-600 text-sm space-y-1">
                {department.services.map((service) => (
                  <li key={service} className="ml-4 flex items-center gap-2">
                    <span className="text-emerald-500">•</span> {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Link
          href={`/departments/${department.id}`}
          className="inline-block w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
