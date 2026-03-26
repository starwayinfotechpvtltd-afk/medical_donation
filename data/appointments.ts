export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  disease: string;
  status: "Pending" | "Approved" | "Cancelled";
  createdAt: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "John Doe",
    patientPhone: "+91-9876543220",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    date: "2024-02-20",
    time: "10:00 AM",
    disease: "Chest pain and shortness of breath",
    status: "Approved",
    createdAt: "2024-02-15",
  },
  {
    id: "APT002",
    patientName: "Jane Smith",
    patientPhone: "+91-9876543221",
    department: "Orthopedics",
    doctor: "Dr. Amit Patel",
    date: "2024-02-21",
    time: "2:30 PM",
    disease: "Knee pain and swelling",
    status: "Pending",
    createdAt: "2024-02-16",
  },
  {
    id: "APT003",
    patientName: "Rajesh Gupta",
    patientPhone: "+91-9876543222",
    department: "Neurology",
    doctor: "Dr. Priya Sharma",
    date: "2024-02-22",
    time: "11:00 AM",
    disease: "Frequent headaches and migraines",
    status: "Approved",
    createdAt: "2024-02-14",
  },
];
