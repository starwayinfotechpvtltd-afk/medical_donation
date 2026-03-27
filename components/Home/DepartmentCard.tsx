// "use client";

// import Link from "next/link";
// import { Bookmark } from "lucide-react";

// interface Department {
//   id: number;
//   name: string;
//   description?: string;
//   location?: string;
// }

// interface Props {
//   department: Department;
// }

// export default function DepartmentCard({ department }: Props) {
//   return (
//     <div className="group bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

//       {/* Soft Inner Card */}
//       <div className="bg-[#E6F4EE] rounded-2xl p-5 relative">

//         {/* Date + Bookmark */}
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600">
//             20 May, 2023
//           </span>

//           <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition">
//             <Bookmark size={14} />
//           </button>
//         </div>

//         {/* Department Label */}
//         <p className="text-sm text-gray-500 mb-1">
//           Healthcare Division
//         </p>

//         {/* Title */}
//         <h3 className="text-xl font-semibold text-gray-900 leading-snug">
//           {department.name}
//         </h3>

//         {/* Pills */}
//         <div className="flex flex-wrap gap-2 mt-4">
//           <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600">
//             Full time
//           </span>
//           <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600">
//             Specialist
//           </span>
//           <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600">
//             On-site
//           </span>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="flex items-center justify-between mt-5">
//         <div>
//           <p className="font-semibold text-gray-900">
//             $150/hr
//           </p>
//           <p className="text-xs text-gray-500">
//             {department.location || "California, CA"}
//           </p>
//         </div>

//         <Link
//           href={`/departments/${department.id}`}
//           className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition"
//         >
//           Details
//         </Link>
//       </div>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Stethoscope } from "lucide-react";
import { Bed } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
  image: string;
  doctors: number;
  beds: number;
  services: string[];
}

interface Props {
  department: Department;
}

export default function DepartmentCard({ department }: Props) {
  return (
    <div className="group bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

      {/* Image Wrapper */}
      <div className="p-4 bg-[#E6F4EE]">
        <div className="relative h-52 w-full rounded-2xl overflow-hidden">
          <Image
            src={department.image}
            alt={department.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* Soft Green Card */}
      <div className="bg-[#E6F4EE] p-6">

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {department.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {department.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
          <span className="flex justify-center gap-2"><Stethoscope size={18} className="text-green-600"/>{department.doctors} Doctors</span>
          <span className="flex justify-center gap-2"><Bed size={18} className="text-green-600" /> {department.beds} Beds</span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-5">
          {department.services.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Healthcare Department
          </p>

          <Link
            href={`/departments/${department.id}`}
            className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
}