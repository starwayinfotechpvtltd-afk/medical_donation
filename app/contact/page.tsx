"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { hospitalInfo } from "@/data/hospital";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.subject &&
      formData.message
    ) {
      console.log("Inquiry submitted:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              Contact Us
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Get in touch with us for any inquiries or to schedule an appointment
            </p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Phone */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl text-center">
                <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Phone</h3>
                <p className="text-slate-600 mb-2">{hospitalInfo.contact.phone}</p>
                <p className="text-sm text-slate-500">Emergency: {hospitalInfo.contact.emergencyPhone}</p>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600 mb-2">{hospitalInfo.contact.email}</p>
                <p className="text-sm text-slate-500">{hospitalInfo.contact.emergencyEmail}</p>
              </div>

              {/* Address */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl text-center">
                <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Location</h3>
                <p className="text-slate-600 text-sm">
                  {hospitalInfo.address.street}
                  <br />
                  {hospitalInfo.address.city}, {hospitalInfo.address.state}{" "}
                  {hospitalInfo.address.pincode}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <SectionHeading
                  title="Send us a Message"
                  description="Fill out the form below and we'll get back to you soon"
                />

                {submitted ? (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-emerald-700 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-emerald-600">
                      We have received your message and will contact you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your message..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Map */}
              <div>
                <SectionHeading
                  title="Find Us on Map"
                  description="Visit us at our main hospital location"
                />
                <div className="h-96 bg-slate-300 rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDmq0Y8f6Jvqrg0e0u4Ks4Z-L0qK7j5M0Q&q=${hospitalInfo.address.street},${hospitalInfo.address.city}`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Working Hours"
              description="We are here for you 24/7"
              centered
            />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Regular Hours</h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">8:00 AM - 8:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Emergency Services</h3>
                <p className="text-slate-700 mb-4">Available 24 hours a day, 7 days a week</p>
                <p className="text-lg font-semibold text-emerald-600">
                  Call {hospitalInfo.contact.emergencyPhone}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
