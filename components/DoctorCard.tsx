import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Phone, Stethoscope, UserRound } from "lucide-react";

export interface PublicDoctor {
  id: number;
  name: string;
  specialization: string;
  qualification: string;
  experience: number | null;
  image: string;
  department: string;
  phone?: string | null;
  bio?: string | null;
}

interface DoctorCardProps {
  doctor: PublicDoctor;
  showContact?: boolean;
}

export function DoctorCard({ doctor, showContact = false }: DoctorCardProps) {
  const hasProfileImage = Boolean(doctor.image);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative h-56 bg-slate-100">
        {hasProfileImage ? (
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <UserRound className="h-10 w-10" />
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{doctor.name}</h3>
        <p className="text-emerald-500 font-medium text-sm mb-2">{doctor.specialization}</p>
        <p className="text-slate-600 text-sm mb-4">{doctor.qualification}</p>
        
        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            <span>
              <span className="font-semibold">Experience:</span>{" "}
              {doctor.experience !== null ? `${doctor.experience} years` : "Not specified"}
            </span>
          </p>
          {showContact && (
            <>
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Stethoscope className="h-4 w-4 text-emerald-500" />
                <span>
                  <span className="font-semibold">Department:</span> {doctor.department}
                </span>
              </p>
              {doctor.phone ? (
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>
                    <span className="font-semibold">Phone:</span> {doctor.phone}
                  </span>
                </p>
              ) : null}
            </>
          )}
        </div>

        <p className="mb-4 min-h-10 text-sm italic text-slate-600">
          {doctor.bio || "Profile details will be updated soon."}
        </p>

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
