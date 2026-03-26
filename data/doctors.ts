export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  image: string;
  department: string;
  phone: string;
  bio: string;
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    qualification: "MD, DM Cardiology",
    experience: 15,
    image: "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=400&h=400&fit=crop",
    department: "Cardiology",
    phone: "+91-9876543210",
    bio: "Specialist in heart disease diagnosis and treatment with 15 years of experience.",
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialization: "Neurologist",
    qualification: "MD, DM Neurology",
    experience: 12,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    department: "Neurology",
    phone: "+91-9876543211",
    bio: "Expert in neurological disorders and treatment. Specialized in Parkinson's and Alzheimer's.",
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    qualification: "MS, DNB Orthopedics",
    experience: 18,
    image: "https://images.unsplash.com/photo-1622121574166-a2a2a2a3a9e5?w=400&h=400&fit=crop",
    department: "Orthopedics",
    phone: "+91-9876543212",
    bio: "Specialized in joint replacement and sports medicine. 18 years of clinical experience.",
  },
  {
    id: "4",
    name: "Dr. Anjali Desai",
    specialization: "General Physician",
    qualification: "MD, General Medicine",
    experience: 10,
    image: "https://images.unsplash.com/photo-1559839734033-6461efaf3cef?w=400&h=400&fit=crop",
    department: "General Medicine",
    phone: "+91-9876543213",
    bio: "Comprehensive healthcare provider with focus on preventive medicine.",
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    specialization: "Pediatrician",
    qualification: "MD, Pediatrics",
    experience: 14,
    image: "https://images.unsplash.com/photo-1537368310025-700d49901020?w=400&h=400&fit=crop",
    department: "Pediatrics",
    phone: "+91-9876543214",
    bio: "Child specialist with expertise in developmental and infectious diseases.",
  },
  {
    id: "6",
    name: "Dr. Sneha Verma",
    specialization: "Gynecologist",
    qualification: "MD, DM Gynecology",
    experience: 16,
    image: "https://images.unsplash.com/photo-1638202993928-7267fbb29bed?w=400&h=400&fit=crop",
    department: "Gynecology",
    phone: "+91-9876543215",
    bio: "Women's health specialist with 16 years of obstetric and gynecologic expertise.",
  },
];
