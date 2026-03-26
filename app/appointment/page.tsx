"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { doctors } from "@/data/doctors";
import { departments } from "@/data/departments";
import { CheckCircle } from "lucide-react";

export default function Appointment() {
  const searchParams = useSearchParams();
  const preSelectedDoctorId = searchParams.get("doctor");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    disease: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(preSelectedDoctorId || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const departmentOptions = departments.map((d) => ({ id: d.id, name: d.name }));
  const doctorOptions = selectedDepartment
    ? doctors.filter((d) => d.department === selectedDepartment)
    : [];

  useEffect(() => {
    if (preSelectedDoctorId) {
      const doctor = doctors.find((d) => d.id === preSelectedDoctorId);
      if (doctor) {
        setSelectedDepartment(doctor.department);
      }
    }
  }, [preSelectedDoctorId]);

  const handleNext = () => {
    if (step === 1 && selectedDepartment) {
      setStep(2);
    } else if (step === 2 && selectedDoctor) {
      setStep(3);
    } else if (step === 3 && selectedDate && selectedTime) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.patientName && formData.patientPhone && formData.disease) {
      // In a real app, this would be sent to a backend
      console.log("Appointment booked:", {
        ...formData,
        selectedDepartment,
        selectedDoctor,
        selectedDate,
        selectedTime,
      });
      setSubmitted(true);
    }
  };

  const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctor);
  const selectedDepartmentObj = departments.find((d) => d.id === selectedDepartment);

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="py-20 bg-slate-50 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Appointment Booked!
              </h1>
              <p className="text-slate-600 text-lg mb-6">
                Thank you for booking your appointment. Our team will confirm your appointment
                shortly.
              </p>

              <div className="bg-slate-50 p-6 rounded-lg mb-8 text-left">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Appointment Details:
                </h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold text-slate-700">Name:</span> {formData.patientName}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Phone:</span>{" "}
                    {formData.patientPhone}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Department:</span>{" "}
                    {selectedDepartmentObj?.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Doctor:</span>{" "}
                    {selectedDoctorObj?.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Date:</span> {selectedDate}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Time:</span> {selectedTime}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Complaint:</span>{" "}
                    {formData.disease}
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.location.href = "/"}
                className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              Book Your Appointment
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Schedule a consultation with our expert doctors
            </p>
          </div>
        </section>

        {/* Appointment Form */}
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Indicator */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        step >= num ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      {num}
                    </div>
                    {num < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step > num ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {step === 1 && "Select Department"}
                  {step === 2 && "Select Doctor"}
                  {step === 3 && "Select Date & Time"}
                  {step === 4 && "Your Details"}
                </h2>
              </div>
            </div>

            {/* Step 1: Department */}
            {step === 1 && (
              <div className="space-y-4 mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Select a Department:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departmentOptions.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.name)}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        selectedDepartment === dept.name
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300"
                      }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Doctor */}
            {step === 2 && (
              <div className="space-y-4 mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Select a Doctor from {selectedDepartmentObj?.name}:
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {doctorOptions.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc.id)}
                      className={`p-4 rounded-lg border-2 text-left font-medium transition-all ${
                        selectedDoctor === doc.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-300 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <p className="font-semibold text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-600">{doc.specialization}</p>
                      <p className="text-xs text-slate-500">{doc.qualification}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Time:
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Choose a time slot</option>
                    <option value="09:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">2:00 PM</option>
                    <option value="03:00 PM">3:00 PM</option>
                    <option value="04:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Patient Details */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, patientPhone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Disease/Complaint Description:
                  </label>
                  <textarea
                    value={formData.disease}
                    onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe your health concern..."
                  ></textarea>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-3">Appointment Summary:</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-slate-600">Department:</span>{" "}
                      <span className="font-semibold">{selectedDepartmentObj?.name}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Doctor:</span>{" "}
                      <span className="font-semibold">{selectedDoctorObj?.name}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Date & Time:</span>{" "}
                      <span className="font-semibold">
                        {selectedDate} at {selectedTime}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Confirm Appointment
                </button>
              </form>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex gap-4">
                {step > 1 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedDepartment) ||
                    (step === 2 && !selectedDoctor) ||
                    (step === 3 && (!selectedDate || !selectedTime))
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    (step === 1 && !selectedDepartment) ||
                    (step === 2 && !selectedDoctor) ||
                    (step === 3 && (!selectedDate || !selectedTime))
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
