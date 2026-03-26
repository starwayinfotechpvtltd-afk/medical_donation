export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const mockInquiries: Inquiry[] = [
  {
    id: "INQ001",
    name: "Arjun Verma",
    email: "arjun@example.com",
    phone: "+91-9876543230",
    subject: "Hospital Facilities",
    message: "I would like to know more about your ICU facilities and visiting hours.",
    createdAt: "2024-02-16",
  },
  {
    id: "INQ002",
    name: "Priya Nair",
    email: "priya@example.com",
    phone: "+91-9876543231",
    subject: "Insurance Query",
    message: "Do you accept ICICI Lombard health insurance?",
    createdAt: "2024-02-15",
  },
  {
    id: "INQ003",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91-9876543232",
    subject: "Emergency Services",
    message: "What are your emergency response times?",
    createdAt: "2024-02-14",
  },
];
