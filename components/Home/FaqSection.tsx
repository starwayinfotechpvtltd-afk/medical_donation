export default function FAQSection() {
  const faqs = [
    {
      question: "How can I book an appointment with a doctor?",
      answer:
        "You can easily book an appointment online through our website by selecting your preferred doctor, date, and time slot.",
    },
    {
      question: "Do you provide emergency medical services?",
      answer:
        "Yes, our hospital provides 24/7 emergency medical services with experienced doctors and advanced medical facilities.",
    },
    {
      question: "Can I access my medical reports online?",
      answer:
        "Yes, patients can securely access and download their medical reports and prescriptions through the patient portal.",
    },
    {
      question: "Do you accept health insurance?",
      answer:
        "We accept a wide range of health insurance providers. Please contact our support team for insurance-related assistance.",
    },
    {
      question: "What specialties are available at the hospital?",
      answer:
        "We offer multiple specialties including Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, and more.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our support team via phone, email, or the contact form available on our website anytime.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gradient from-green-50 via-white to-white">
      <div className="max-w-[90%] lg:max-w-[90%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
            Frequently Asked Questions
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Got Questions?
            <span className="text-green-600"> We’ve Got Answers.</span>
          </h2>

          <p className="mt-5 text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Find quick answers to the most common questions about our hospital,
            appointments, medical services, patient care, and online support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-gray-900 pr-5">
                  {faq.question}
                </h3>

                <div className="min-w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl transition-transform duration-300 group-open:rotate-45">
                  +
                </div>
              </summary>

              <p className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
