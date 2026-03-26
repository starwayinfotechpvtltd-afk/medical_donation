import Image from "next/image";
import Link from "next/link";
import { type Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  showContact?: boolean;
}

export function DoctorCard({ doctor, showContact = false }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-56 bg-slate-200">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{doctor.name}</h3>
        <p className="text-emerald-500 font-medium text-sm mb-2">{doctor.specialization}</p>
        <p className="text-slate-600 text-sm mb-4">{doctor.qualification}</p>
        
        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
          <p className="text-slate-700 text-sm">
            <span className="font-semibold">Experience:</span> {doctor.experience} years
          </p>
          {showContact && (
            <>
              <p className="text-slate-700 text-sm">
                <span className="font-semibold">Department:</span> {doctor.department}
              </p>
              <p className="text-slate-700 text-sm">
                <span className="font-semibold">Phone:</span> {doctor.phone}
              </p>
            </>
          )}
        </div>

        <p className="text-slate-600 text-sm mb-4 italic">{doctor.bio}</p>

        <Link
          href={`/appointment?doctor=${doctor.id}`}
          className="inline-block w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
