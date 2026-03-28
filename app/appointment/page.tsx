// "use client";

// export const dynamic = "force-dynamic";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { doctors } from "@/data/doctors";
// import { departments } from "@/data/departments";
// import { CheckCircle } from "lucide-react";

// export default function Appointment() {
//   const searchParams = useSearchParams();

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     patientName: "",
//     patientPhone: "",
//     disease: "",
//   });

//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   // ✅ Safe search param handling (client-side only)
//   useEffect(() => {
//     const doctorId = searchParams.get("doctor");

//     if (doctorId) {
//       setSelectedDoctor(doctorId);

//       const doctor = doctors.find((d) => d.id === doctorId);
//       if (doctor) {
//         setSelectedDepartment(doctor.department);
//         setStep(2);
//       }
//     }
//   }, [searchParams]);

//   const departmentOptions = departments.map((d) => ({
//     id: d.id,
//     name: d.name,
//   }));

//   const doctorOptions = selectedDepartment
//     ? doctors.filter((d) => d.department === selectedDepartment)
//     : [];

//   const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctor);
//   const selectedDepartmentObj = departments.find(
//     (d) => d.name === selectedDepartment
//   );

//   const handleNext = () => {
//     if (step === 1 && selectedDepartment) setStep(2);
//     else if (step === 2 && selectedDoctor) setStep(3);
//     else if (step === 3 && selectedDate && selectedTime) setStep(4);
//   };

//   const handlePrev = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.patientName && formData.patientPhone && formData.disease) {
//       console.log("Appointment booked:", {
//         ...formData,
//         selectedDepartment,
//         selectedDoctor,
//         selectedDate,
//         selectedTime,
//       });
//       setSubmitted(true);
//     }
//   };

//   if (submitted) {
//     return (
//       <>
//         <Navbar />
//         <main className="py-20 bg-slate-50 min-h-screen">
//           <div className="max-w-2xl mx-auto px-4">
//             <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
//               <h1 className="text-3xl font-bold mb-4">
//                 Appointment Booked!
//               </h1>
//               <p className="text-slate-600 mb-6">
//                 Thank you. Our team will confirm your appointment shortly.
//               </p>

//               <div className="bg-slate-50 p-6 rounded-lg text-left mb-6">
//                 <p><strong>Name:</strong> {formData.patientName}</p>
//                 <p><strong>Phone:</strong> {formData.patientPhone}</p>
//                 <p><strong>Department:</strong> {selectedDepartmentObj?.name}</p>
//                 <p><strong>Doctor:</strong> {selectedDoctorObj?.name}</p>
//                 <p><strong>Date:</strong> {selectedDate}</p>
//                 <p><strong>Time:</strong> {selectedTime}</p>
//                 <p><strong>Complaint:</strong> {formData.disease}</p>
//               </div>

//               <button
//                 onClick={() => (window.location.href = "/")}
//                 className="bg-emerald-500 text-white px-6 py-3 rounded-lg"
//               >
//                 Back to Home
//               </button>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <main className="py-20 bg-white min-h-screen">
//         <div className="max-w-2xl mx-auto px-4">

//           <h1 className="text-4xl font-bold mb-10">
//             Book Your Appointment
//           </h1>

//           {/* Step 1 */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <h2 className="font-semibold">Select Department</h2>
//               {departmentOptions.map((dept) => (
//                 <button
//                   key={dept.id}
//                   onClick={() => setSelectedDepartment(dept.name)}
//                   className={`block w-full p-3 border rounded-lg ${
//                     selectedDepartment === dept.name
//                       ? "bg-emerald-100 border-emerald-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {dept.name}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Step 2 */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <h2 className="font-semibold">Select Doctor</h2>
//               {doctorOptions.map((doc) => (
//                 <button
//                   key={doc.id}
//                   onClick={() => setSelectedDoctor(doc.id)}
//                   className={`block w-full p-3 border rounded-lg ${
//                     selectedDoctor === doc.id
//                       ? "bg-emerald-100 border-emerald-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {doc.name}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Step 3 */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <h2 className="font-semibold">Select Date & Time</h2>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="w-full border p-3 rounded-lg"
//               />
//               <select
//                 value={selectedTime}
//                 onChange={(e) => setSelectedTime(e.target.value)}
//                 className="w-full border p-3 rounded-lg"
//               >
//                 <option value="">Select Time</option>
//                 <option value="09:00 AM">9:00 AM</option>
//                 <option value="10:00 AM">10:00 AM</option>
//               </select>
//             </div>
//           )}

//           {/* Step 4 */}
//           {step === 4 && (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 required
//                 value={formData.patientName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, patientName: e.target.value })
//                 }
//                 className="w-full border p-3 rounded-lg"
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 required
//                 value={formData.patientPhone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, patientPhone: e.target.value })
//                 }
//                 className="w-full border p-3 rounded-lg"
//               />
//               <textarea
//                 placeholder="Describe your issue"
//                 required
//                 value={formData.disease}
//                 onChange={(e) =>
//                   setFormData({ ...formData, disease: e.target.value })
//                 }
//                 className="w-full border p-3 rounded-lg"
//               />

//               <button
//                 type="submit"
//                 className="w-full bg-emerald-500 text-white py-3 rounded-lg"
//               >
//                 Confirm Appointment
//               </button>
//             </form>
//           )}

//           {/* Navigation */}
//           {step < 4 && (
//             <div className="flex gap-4 mt-6">
//               {step > 1 && (
//                 <button
//                   onClick={handlePrev}
//                   className="flex-1 border p-3 rounded-lg"
//                 >
//                   Previous
//                 </button>
//               )}
//               <button
//                 onClick={handleNext}
//                 className="flex-1 bg-emerald-500 text-white p-3 rounded-lg"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }




"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { doctors } from "@/data/doctors";
import { departments } from "@/data/departments";

export default function Appointment() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    disease: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const doctorOptions = doctors.filter(
    (doc) => doc.department === formData.department
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment Data:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Appointment Booked ✅
            </h1>
            <p className="text-slate-600 mb-6">
              Thank you! We will contact you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Book Another
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-20 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-10 text-center">
            Book Appointment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.patientPhone}
              onChange={(e) =>
                setFormData({ ...formData, patientPhone: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                  doctor: "",
                })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              required
              value={formData.doctor}
              onChange={(e) =>
                setFormData({ ...formData, doctor: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Doctor</option>
              {doctorOptions.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <select
              required
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
            </select>

            <textarea
              placeholder="Describe your issue"
              required
              value={formData.disease}
              onChange={(e) =>
                setFormData({ ...formData, disease: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
            >
              Confirm Appointment
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}