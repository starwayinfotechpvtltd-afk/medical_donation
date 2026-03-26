// "use client";

// import { AdminSidebar } from "@/components/AdminSidebar";

// import { mockAppointments } from "@/data/appointments";
// import { ShieldCheck, Users, FlaskConical, Activity, TrendingUp } from "lucide-react";

// export default function AdminDashboard() {
//   const stats = [
//     {
//       label: "Total Users",
//       value: 156,
//       icon: Users,
//       color: "bg-blue-500",
//     },
//     {
//       label: "Total Roles",
//       value: 5,
//       icon: ShieldCheck,
//       color: "bg-indigo-500",
//     },
//     {
//       label: "Lab Tests",
//       value: 48,
//       icon: FlaskConical,
//       color: "bg-cyan-500",
//     },
//     {
//       label: "System Activity",
//       value: 324,
//       icon: Activity,
//       color: "bg-purple-500",
//     },
//   ];

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />
//       <main className="flex-1 p-8 bg-gradient-to-br from-indigo-50 to-blue-50">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>

//           {/* Stats Grid */}
//           <div className="grid md:grid-cols-4 gap-6 mb-12">
//             {stats.map((stat) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className={`${stat.color} p-3 rounded-lg`}>
//                       <Icon className="w-6 h-6 text-white" />
//                     </div>
//                     <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
//                   </div>
//                   <p className="text-slate-600 font-medium">{stat.label}</p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Activity Monitoring Section */}
//           <div className="mb-12">
//             <h2 className="text-2xl font-bold text-white mb-6">System Activity Monitor</h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                 <p className="text-slate-400 text-sm mb-2">Patient Activity</p>
//                 <p className="text-3xl font-bold text-white mb-3">{activityStats.patientActivity}</p>
//                 <div className="w-full bg-slate-700 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${(activityStats.patientActivity / activityStats.totalActivity) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                 <p className="text-slate-400 text-sm mb-2">Doctor Activity</p>
//                 <p className="text-3xl font-bold text-white mb-3">{activityStats.doctorActivity}</p>
//                 <div className="w-full bg-slate-700 rounded-full h-2">
//                   <div 
//                     className="bg-blue-600 h-2 rounded-full"
//                     style={{ width: `${(activityStats.doctorActivity / activityStats.totalActivity) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                 <p className="text-slate-400 text-sm mb-2">Lab Tech Activity</p>
//                 <p className="text-3xl font-bold text-white mb-3">{activityStats.labActivity}</p>
//                 <div className="w-full bg-slate-700 rounded-full h-2">
//                   <div 
//                     className="bg-purple-600 h-2 rounded-full"
//                     style={{ width: `${(activityStats.labActivity / activityStats.totalActivity) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                 <p className="text-slate-400 text-sm mb-2">Total Activities</p>
//                 <p className="text-3xl font-bold text-white">{activityStats.totalActivity}</p>
//                 <p className="text-slate-400 text-xs mt-3">Last 24 hours</p>
//               </div>
//             </div>
//           </div>

//           {/* Recent Appointments */}
//           <div className="grid md:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Appointments</h2>
//               <div className="space-y-4">
//                 {mockAppointments.slice(0, 5).map((apt) => (
//                   <div key={apt.id} className="pb-4 border-b border-slate-200 last:border-b-0">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-semibold text-slate-900">{apt.patientName}</p>
//                         <p className="text-sm text-slate-600">{apt.department}</p>
//                         <p className="text-xs text-slate-500">
//                           {apt.date} at {apt.time}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           apt.status === "Approved"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : apt.status === "Pending"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {apt.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
//               <h2 className="text-2xl font-bold text-white mb-4">Recent System Activity</h2>
//               <div className="space-y-3">
//                 {activityLogs.slice(0, 5).map((log) => (
//                   <div key={log.id} className="pb-3 border-b border-slate-700 last:border-b-0">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <p className="font-semibold text-white text-sm">{log.userName}</p>
//                         <p className="text-xs text-slate-400">{log.description}</p>
//                       </div>
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         log.userRole === 'patient' ? 'bg-blue-100 text-blue-800' :
//                         log.userRole === 'doctor' ? 'bg-blue-600 text-white' :
//                         log.userRole === 'lab_technician' ? 'bg-purple-100 text-purple-800' :
//                         'bg-emerald-100 text-emerald-800'
//                       }`}>
//                         {log.userRole === 'lab_technician' ? 'Lab Tech' : log.userRole.charAt(0).toUpperCase() + log.userRole.slice(1)}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold text-slate-900 mb-4">Appointment Status</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-700 font-medium">Approved</span>
//                   <div className="w-40 bg-slate-200 rounded-full h-2">
//                     <div className="bg-emerald-500 h-2 rounded-full w-1/2"></div>
//                   </div>
//                   <span className="text-slate-900 font-semibold">
//                     {mockAppointments.filter((a) => a.status === "Approved").length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-700 font-medium">Pending</span>
//                   <div className="w-40 bg-slate-200 rounded-full h-2">
//                     <div
//                       className="bg-yellow-500 h-2 rounded-full"
//                       style={{
//                         width: `${
//                           (mockAppointments.filter((a) => a.status === "Pending").length /
//                             mockAppointments.length) *
//                           100
//                         }%`,
//                       }}
//                     ></div>
//                   </div>
//                   <span className="text-slate-900 font-semibold">
//                     {mockAppointments.filter((a) => a.status === "Pending").length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-700 font-medium">Cancelled</span>
//                   <div className="w-40 bg-slate-200 rounded-full h-2">
//                     <div
//                       className="bg-red-500 h-2 rounded-full"
//                       style={{
//                         width: `${
//                           (mockAppointments.filter((a) => a.status === "Cancelled").length /
//                             mockAppointments.length) *
//                           100
//                         }%`,
//                       }}
//                     ></div>
//                   </div>
//                   <span className="text-slate-900 font-semibold">
//                     {mockAppointments.filter((a) => a.status === "Cancelled").length}
//                   </span>
//                 </div>

//                 <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
//                   <p className="text-sm text-emerald-700">
//                     <span className="font-semibold">Pro Tip:</span> Manage appointments from the
//                     appointments section to update their status.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
//             <div className="grid md:grid-cols-4 gap-4">
//               <a
//                 href="/admin/doctors"
//                 className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
//               >
//                 <p className="font-semibold text-slate-900 mb-2">Manage Doctors</p>
//                 <p className="text-sm text-slate-600">Add, edit, or remove doctors</p>
//               </a>
//               <a
//                 href="/admin/appointments"
//                 className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
//               >
//                 <p className="font-semibold text-slate-900 mb-2">View Appointments</p>
//                 <p className="text-sm text-slate-600">Manage appointment requests</p>
//               </a>
//               <a
//                 href="/admin/departments"
//                 className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
//               >
//                 <p className="font-semibold text-slate-900 mb-2">Manage Departments</p>
//                 <p className="text-sm text-slate-600">Add or edit departments</p>
//               </a>
//               <a
//                 href="/admin/inquiries"
//                 className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
//               >
//                 <p className="font-semibold text-slate-900 mb-2">View Inquiries</p>
//                 <p className="text-sm text-slate-600">See contact messages</p>
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { mockAppointments } from "@/data/appointments";
import {
  ShieldCheck,
  Users,
  FlaskConical,
  Activity,
} from "lucide-react";

// ✅ SAFE MOCK DATA (replace later with API)
const activityStats = {
  patientActivity: 120,
  doctorActivity: 80,
  labActivity: 60,
  totalActivity: 260,
};

const activityLogs = [
  {
    id: 1,
    userName: "John Doe",
    description: "Booked an appointment",
    userRole: "patient",
    timestamp: new Date(),
  },
  {
    id: 2,
    userName: "Dr. Smith",
    description: "Updated patient record",
    userRole: "doctor",
    timestamp: new Date(),
  },
  {
    id: 3,
    userName: "Lab Tech Alex",
    description: "Uploaded test results",
    userRole: "lab_technician",
    timestamp: new Date(),
  },
];

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: 156,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Roles",
      value: 5,
      icon: ShieldCheck,
      color: "bg-indigo-500",
    },
    {
      label: "Lab Tests",
      value: 48,
      icon: FlaskConical,
      color: "bg-cyan-500",
    },
    {
      label: "System Activity",
      value: activityStats.totalActivity,
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Dashboard Overview
          </h1>

          {/* ================= STATS ================= */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-slate-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* ================= ACTIVITY ================= */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              System Activity Monitor
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  label: "Patient Activity",
                  value: activityStats.patientActivity,
                  color: "bg-blue-500",
                },
                {
                  label: "Doctor Activity",
                  value: activityStats.doctorActivity,
                  color: "bg-indigo-500",
                },
                {
                  label: "Lab Activity",
                  value: activityStats.labActivity,
                  color: "bg-purple-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <p className="text-slate-500 text-sm mb-2">
                    {item.label}
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mb-3">
                    {item.value}
                  </p>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{
                        width: `${
                          (item.value /
                            (activityStats.totalActivity || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-slate-500 text-sm mb-2">
                  Total Activities
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {activityStats.totalActivity}
                </p>
                <p className="text-slate-400 text-xs mt-3">
                  Last 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* ================= CARDS ================= */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">

            {/* APPOINTMENTS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">
                Recent Appointments
              </h2>

              <div className="space-y-4">
                {mockAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="border-b pb-3">
                    <p className="font-semibold">{apt.patientName}</p>
                    <p className="text-sm text-slate-500">
                      {apt.department}
                    </p>
                    <p className="text-xs text-slate-400">
                      {apt.date} • {apt.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">
                Recent Activity
              </h2>

              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="border-b pb-2">
                    <p className="font-medium text-sm">
                      {log.userName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {log.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Quick Actions
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: "Doctors", link: "/admin/doctors" },
                { name: "Appointments", link: "/admin/appointments" },
                { name: "Departments", link: "/admin/departments" },
                { name: "Inquiries", link: "/admin/inquiries" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 text-center transition"
                >
                  <p className="font-semibold">{item.name}</p>
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}