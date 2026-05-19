// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { api, ApiException } from "@/lib/api-client";
// import { Calendar, Clock3, Stethoscope, Building2, CheckCircle2 } from "lucide-react";

// type Department = {
//   id: number;
//   name: string;
// };

// type Doctor = {
//   id: number;
//   first_name: string;
//   last_name: string;
//   specialization?: string | null;
//   departments?: string | null;
// };

// export default function AppointmentPage() {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [successId, setSuccessId] = useState<number | null>(null);

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     doctor_profile_id: "",
//     scheduled_date: "",
//     scheduled_time: "",
//     type: "in_person",
//     disease: "",
//     reason: "",
//   });

//   useEffect(() => {
//     let alive = true;

//     const load = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const [deptRes, docRes] = await Promise.all([
//           api.get<Department[]>("/departments"),
//           api.get<Doctor[]>("/doctors"),
//         ]);
//         if (!alive) return;
//         setDepartments((deptRes.data ?? []) as Department[]);
//         setDoctors((docRes.data ?? []) as Doctor[]);
//       } catch (err) {
//         if (!alive) return;
//         setError(err instanceof Error ? err.message : "Failed to load appointment form data.");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     };

//     load();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const filteredDoctors = useMemo(() => {
//     if (!form.department_id) return doctors;
//     const selectedDepartment = departments.find((d) => d.id === Number(form.department_id));
//     if (!selectedDepartment) return doctors;
//     const needle = selectedDepartment.name.toLowerCase();
//     return doctors.filter((doc) => (doc.departments || "").toLowerCase().includes(needle));
//   }, [form.department_id, departments, doctors]);

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();
//     setError("");

//     if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.department_id || !form.doctor_profile_id || !form.scheduled_date || !form.scheduled_time || !form.reason.trim()) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await api.post<{ id: number }>("/appointments", {
//         first_name: form.first_name.trim(),
//         last_name: form.last_name.trim(),
//         email: form.email.trim().toLowerCase(),
//         phone: form.phone.trim() || null,
//         department_id: Number(form.department_id),
//         doctor_profile_id: Number(form.doctor_profile_id),
//         scheduled_date: form.scheduled_date,
//         scheduled_time: form.scheduled_time,
//         type: form.type,
//         disease: form.disease || null,
//         reason: form.reason.trim(),
//       });

//       setSuccessId((res.data as { id: number } | undefined)?.id ?? null);
//       setForm({
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         department_id: "",
//         doctor_profile_id: "",
//         scheduled_date: "",
//         scheduled_time: "",
//         type: "in_person",
//         disease: "",
//         reason: "",
//       });
//     } catch (err) {
//       if (err instanceof ApiException) {
//         setError(err.message);
//       } else {
//         setError("Could not book appointment. Please try again.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
//         <div className="mx-auto max-w-4xl px-4">
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//             <div className="mb-6">
//               <p className="text-sm font-semibold text-teal-600">Patient Booking</p>
//               <h1 className="mt-1 text-3xl font-bold text-slate-900">Book Appointment</h1>
//               <p className="mt-2 text-sm text-slate-500">
//                 Submit your appointment request with your details. It will appear in admin appointments for approval.
//               </p>
//             </div>

//             {successId ? (
//               <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
//                 <div className="flex items-start gap-2">
//                   <CheckCircle2 className="mt-0.5 h-4 w-4" />
//                   Appointment request submitted successfully. Request ID: #{successId}. Status is pending until admin/doctor approval.
//                 </div>
//               </div>
//             ) : null}

//             {error ? (
//               <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
//             ) : null}

//             {loading ? (
//               <p className="text-sm text-slate-500">Loading departments and doctors...</p>
//             ) : (
//               <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">First Name</span>
//                   <input
//                     required
//                     value={form.first_name}
//                     onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Last Name</span>
//                   <input
//                     required
//                     value={form.last_name}
//                     onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Email</span>
//                   <input
//                     type="email"
//                     required
//                     value={form.email}
//                     onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Phone</span>
//                   <input
//                     value={form.phone}
//                     onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Department</span>
//                   <div className="relative">
//                     <Building2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
//                     <select
//                       required
//                       value={form.department_id}
//                       onChange={(e) => setForm((s) => ({ ...s, department_id: e.target.value, doctor_profile_id: "" }))}
//                       className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-3 outline-none focus:border-teal-500"
//                     >
//                       <option value="">Select department</option>
//                       {departments.map((dept) => (
//                         <option key={dept.id} value={dept.id}>{dept.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Doctor</span>
//                   <div className="relative">
//                     <Stethoscope className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
//                     <select
//                       required
//                       value={form.doctor_profile_id}
//                       onChange={(e) => setForm((s) => ({ ...s, doctor_profile_id: e.target.value }))}
//                       className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-3 outline-none focus:border-teal-500"
//                     >
//                       <option value="">Select doctor</option>
//                       {filteredDoctors.map((doc) => (
//                         <option key={doc.id} value={doc.id}>
//                           Dr. {doc.first_name} {doc.last_name}{doc.specialization ? ` - ${doc.specialization}` : ""}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Date</span>
//                   <div className="relative">
//                     <Calendar className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
//                     <input
//                       type="date"
//                       required
//                       min={new Date().toISOString().split("T")[0]}
//                       value={form.scheduled_date}
//                       onChange={(e) => setForm((s) => ({ ...s, scheduled_date: e.target.value }))}
//                       className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-3 outline-none focus:border-teal-500"
//                     />
//                   </div>
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Time</span>
//                   <div className="relative">
//                     <Clock3 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
//                     <input
//                       type="time"
//                       required
//                       value={form.scheduled_time}
//                       onChange={(e) => setForm((s) => ({ ...s, scheduled_time: e.target.value }))}
//                       className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-3 outline-none focus:border-teal-500"
//                     />
//                   </div>
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Appointment Type</span>
//                   <select
//                     value={form.type}
//                     onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   >
//                     <option value="in_person">In Person</option>
//                     <option value="teleconsultation">Teleconsultation</option>
//                   </select>
//                 </label>

//                 <label className="space-y-1 text-sm">
//                   <span className="font-medium text-slate-700">Disease / Condition</span>
//                   <input
//                     type="text"
//                     value={form.disease}
//                     onChange={(e) => setForm((s) => ({ ...s, disease: e.target.value }))}
//                     placeholder="Optional"
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <label className="space-y-1 text-sm sm:col-span-2">
//                   <span className="font-medium text-slate-700">Reason for Visit</span>
//                   <textarea
//                     required
//                     rows={4}
//                     value={form.reason}
//                     onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
//                     placeholder="Describe your symptoms or concern"
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-500"
//                   />
//                 </label>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="sm:col-span-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
//                 >
//                   {submitting ? "Submitting..." : "Submit Appointment Request"}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }



"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api, ApiException } from "@/lib/api-client";
import {
  Calendar,
  Clock3,
  Stethoscope,
  Building2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Video,
  Building,
  AlertCircle,
  Check,
} from "lucide-react";

type Department = { id: number; name: string };
type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  specialization?: string | null;
  departments?: string | null;
};

const STEPS = ["Patient Info", "Appointment", "Review"];

const FIELD_CLASSES =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10";

const ICON_INPUT_WRAP = "relative";
const ICON_CLASS =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400";
const ICON_PADDED = `${FIELD_CLASSES} pl-9`;

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  department_id: string;
  doctor_profile_id: string;
  scheduled_date: string;
  scheduled_time: string;
  type: string;
  disease: string;
  reason: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  department_id: "",
  doctor_profile_id: "",
  scheduled_date: "",
  scheduled_time: "",
  type: "in_person",
  disease: "",
  reason: "",
};

export default function AppointmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get<Department[]>("/departments"),
          api.get<Doctor[]>("/doctors"),
        ]);
        if (!alive) return;
        setDepartments((deptRes.data ?? []) as Department[]);
        setDoctors((docRes.data ?? []) as Doctor[]);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load form data.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!form.department_id) return doctors;
    const dept = departments.find((d) => d.id === Number(form.department_id));
    if (!dept) return doctors;
    const needle = dept.name.toLowerCase();
    return doctors.filter((doc) => (doc.departments || "").toLowerCase().includes(needle));
  }, [form.department_id, departments, doctors]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const validateStep = (s: number): string => {
    if (s === 0) {
      if (!form.first_name.trim()) return "First name is required.";
      if (!form.last_name.trim()) return "Last name is required.";
      if (!form.email.trim()) return "Email address is required.";
      if (!form.dob) return "Date of birth is required.";
      if (!form.gender) return "Please select a gender.";
      if (!form.address.trim()) return "Address is required.";
    }
    if (s === 1) {
      if (!form.department_id) return "Please select a department.";
      if (!form.scheduled_date) return "Please choose a date.";
      if (!form.scheduled_time) return "Please choose a time.";
      if (!form.reason.trim()) return "Reason for visit is required.";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleBack = () => { setError(""); setStep((s) => s - 1); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post<{ id: number }>("/appointments", {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        dob: form.dob || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
        department_id: Number(form.department_id),
        doctor_profile_id: form.doctor_profile_id ? Number(form.doctor_profile_id) : null,
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time,
        type: form.type,
        disease: form.disease || null,
        reason: form.reason.trim(),
      });
      setSuccessId((res.data as { id: number } | undefined)?.id ?? null);
      // Stay on step 2 (Review tab) — success screen renders there
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Could not book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const reviewRows: [string, string][] = [
    ["Full Name", `${form.first_name} ${form.last_name}`],
    ["Email", form.email],
    ["Phone", form.phone || "—"],
    ["Date of Birth", form.dob || "—"],
    ["Gender", form.gender || "—"],
    ["Address", form.address || "—"],
    ["Department", departments.find((d) => d.id === Number(form.department_id))?.name || "—"],
    ["Doctor", (() => { const d = doctors.find((d) => d.id === Number(form.doctor_profile_id)); return d ? `Dr. ${d.first_name} ${d.last_name}${d.specialization ? ` — ${d.specialization}` : ""}` : "—"; })()],
    ["Date", form.scheduled_date || "—"],
    ["Time", form.scheduled_time || "—"],
    ["Type", form.type === "in_person" ? "In Person" : "Teleconsultation"],
    ["Condition", form.disease || "—"],
    ["Reason", form.reason],
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="mx-auto max-w-2xl">


          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ── Hero header ── */}
            <div className="bg-teal-700 px-8 py-7">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
                Patient Booking
              </p>
              <h1 className="text-2xl font-bold text-white">Book an Appointment</h1>
              <p className="mt-1.5 text-sm text-teal-200">
                Fill in the form below. Your request will appear in the admin panel for approval.
              </p>
            </div>

            {/* ── Progress bar ── */}
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* ── Step tabs ── */}
            <div className="flex border-b border-slate-100">
              {STEPS.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-medium transition
                      ${active ? "border-teal-600 text-teal-700" : done ? "border-transparent text-teal-600 cursor-pointer" : "border-transparent text-slate-400 cursor-default"}`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition
                      ${active ? "bg-teal-600 text-white" : done ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Error bar ── */}
            {error && (
              <div className="mx-6 mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="px-8 py-12 text-center text-sm text-slate-400">Loading form data…</div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* ════ STEP 1 — Patient Info ════ */}
                {step === 0 && (
                  <div className="px-8 py-7 space-y-5">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <User className="h-3.5 w-3.5" /> Personal Details
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">First Name <span className="text-red-400">*</span></span>
                        <input className={FIELD_CLASSES} placeholder="e.g. Sarah" value={form.first_name} onChange={set("first_name")} />
                      </label>
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Last Name <span className="text-red-400">*</span></span>
                        <input className={FIELD_CLASSES} placeholder="e.g. Johnson" value={form.last_name} onChange={set("last_name")} />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Email <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Mail className={ICON_CLASS} />
                          <input type="email" className={ICON_PADDED} placeholder="you@example.com" value={form.email} onChange={set("email")} />
                        </div>
                      </label>
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Phone</span>
                        <div className={ICON_INPUT_WRAP}>
                          <Phone className={ICON_CLASS} />
                          <input type="tel" className={ICON_PADDED} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Date of Birth */}
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Date of Birth <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Calendar className={ICON_CLASS} />
                          <input
                            type="date"
                            className={ICON_PADDED}
                            max={new Date().toISOString().split("T")[0]}
                            value={form.dob}
                            onChange={set("dob")}
                          />
                        </div>
                      </label>

                      {/* Gender */}
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Gender <span className="text-red-400">*</span></span>
                        <select className={FIELD_CLASSES} value={form.gender} onChange={set("gender")}>
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non_binary">Non-binary</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </label>
                    </div>

                    {/* Address */}
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium text-slate-700">Address <span className="text-red-400">*</span></span>
                      <div className={ICON_INPUT_WRAP}>
                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea
                          rows={2}
                          className={`${FIELD_CLASSES} pl-9 resize-none`}
                          placeholder="Street, City, State, PIN"
                          value={form.address}
                          onChange={set("address")}
                        />
                      </div>
                    </label>
                  </div>
                )}

                {/* ════ STEP 2 — Appointment Details ════ */}
                {step === 1 && (
                  <div className="px-8 py-7 space-y-5">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <Calendar className="h-3.5 w-3.5" /> Appointment Details
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Department <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Building2 className={ICON_CLASS} />
                          <select
                            className={ICON_PADDED}
                            value={form.department_id}
                            onChange={(e) => setForm((s) => ({ ...s, department_id: e.target.value, doctor_profile_id: "" }))}
                          >
                            <option value="">Select department</option>
                            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        </div>
                      </label>

                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Doctor <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Stethoscope className={ICON_CLASS} />
                          <select className={ICON_PADDED} value={form.doctor_profile_id} onChange={set("doctor_profile_id")}>
                            <option value="">Any available doctor</option>
                            {filteredDoctors.map((d) => (
                              <option key={d.id} value={d.id}>
                                Dr. {d.first_name} {d.last_name}{d.specialization ? ` — ${d.specialization}` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Date <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Calendar className={ICON_CLASS} />
                          <input
                            type="date"
                            className={ICON_PADDED}
                            min={new Date().toISOString().split("T")[0]}
                            value={form.scheduled_date}
                            onChange={set("scheduled_date")}
                          />
                        </div>
                      </label>

                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Time <span className="text-red-400">*</span></span>
                        <div className={ICON_INPUT_WRAP}>
                          <Clock3 className={ICON_CLASS} />
                          <input type="time" className={ICON_PADDED} value={form.scheduled_time} onChange={set("scheduled_time")} />
                        </div>
                      </label>
                    </div>

                    {/* Appointment type pills */}
                    <div className="space-y-1.5 text-sm">
                      <span className="font-medium text-slate-700">Appointment Type</span>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {[
                          { value: "in_person", label: "In Person", Icon: Building },
                          { value: "teleconsultation", label: "Teleconsultation", Icon: Video },
                        ].map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm((s) => ({ ...s, type: value }))}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition
                              ${form.type === value
                                ? "border-teal-500 bg-teal-50 text-teal-700"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                              }`}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm">
                        <span className="font-medium text-slate-700">Disease / Condition</span>
                        <input className={FIELD_CLASSES} placeholder="Optional" value={form.disease} onChange={set("disease")} />
                      </label>
                    </div>

                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium text-slate-700">Reason for Visit <span className="text-red-400">*</span></span>
                      <textarea
                        rows={4}
                        className={`${FIELD_CLASSES} resize-none`}
                        placeholder="Describe your symptoms or concern…"
                        value={form.reason}
                        onChange={set("reason")}
                      />
                    </label>
                  </div>
                )}

                {/* ════ STEP 3 — Review ════ */}
                {step === 2 && !successId && (
                  <div className="px-8 py-7 space-y-5">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Review &amp; Confirm
                    </p>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 overflow-hidden">
                      {reviewRows.map(([label, value]) => (
                        <div key={label} className="flex items-start gap-4 px-5 py-3 text-sm">
                          <span className="w-32 shrink-0 text-slate-400">{label}</span>
                          <span className="text-slate-800 font-medium break-words">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">
                      By submitting, you agree your details will be reviewed by our admin team. You'll be notified once the appointment is confirmed.
                    </p>
                  </div>
                )}

                {/* ════ STEP 3 — Success (after submission) ════ */}
                {step === 2 && successId && (
                  <div className="px-8 py-12 flex flex-col items-center text-center space-y-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 ring-8 ring-teal-50/60">
                      <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-xl font-semibold text-slate-900">Appointment Submitted!</h2>
                      <p className="text-sm text-slate-500">
                        Your request{" "}
                        <span className="font-semibold text-teal-700">#{successId}</span>{" "}
                        has been received and is pending approval from our admin team.
                      </p>
                    </div>
                    <div className="w-full rounded-2xl border border-teal-100 bg-teal-50 px-6 py-4 text-left space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Booking Summary</p>
                      {[
                        ["Patient", `${form.first_name} ${form.last_name}`],
                        ["Doctor", (() => { const d = doctors.find((d) => d.id === Number(form.doctor_profile_id)); return d ? `Dr. ${d.first_name} ${d.last_name}` : "—"; })()],
                        ["Date & Time", `${form.scheduled_date} at ${form.scheduled_time}`],
                        ["Type", form.type === "in_person" ? "In Person" : "Teleconsultation"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-teal-700/70">{label}</span>
                          <span className="font-medium text-teal-900">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">
                      You'll be notified at <span className="font-medium text-slate-600">{form.email}</span> once your appointment is confirmed.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setSuccessId(null); setForm(EMPTY_FORM); setStep(0); setError(""); }}
                      className="mt-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-700"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                )}

                {/* ── Footer navigation — hidden after successful submission ── */}
                {!successId && (
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-8 py-4">
                    <span className="text-xs text-slate-400">Step {step + 1} of {STEPS.length}</span>
                    <div className="flex gap-3">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <ChevronLeft className="h-4 w-4" /> Back
                        </button>
                      )}
                      {step < 2 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-95"
                        >
                          Continue <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {submitting ? "Submitting…" : "Submit Request"}
                          {!submitting && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
