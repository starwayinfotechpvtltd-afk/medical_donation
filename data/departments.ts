export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  doctors: number;
  beds: number;
  services: string[];
}

export const departments: Department[] = [
  {
    id: "1",
    name: "Cardiology",
    description:
      "Comprehensive heart and cardiovascular system care with advanced diagnostic and treatment facilities.",
    icon: "❤️",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    doctors: 5,
    beds: 20,
    services: [
      "Cardiac Surgery",
      "ECG & Echo",
      "Cardiac Catheterization",
      "Pacemaker Implantation",
      "Coronary Angioplasty",
    ],
  },
  {
    id: "2",
    name: "Orthopedics",
    description:
      "Expert care for bones, joints, and musculoskeletal system. Advanced surgical and non-surgical treatments.",
    icon: "🦴",
    image: "https://images.unsplash.com/photo-1631217b5bafb1b51d5f5ff004a3b814?w=800&h=400&fit=crop",
    doctors: 6,
    beds: 25,
    services: [
      "Joint Replacement",
      "Orthopedic Surgery",
      "Sports Medicine",
      "Arthroscopy",
      "Trauma Care",
    ],
  },
  {
    id: "3",
    name: "Neurology",
    description: "Specialized treatment for brain, spine, and nervous system disorders.",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1584308666744-24d5f400f6f1?w=800&h=400&fit=crop",
    doctors: 4,
    beds: 15,
    services: [
      "Neurological Surgery",
      "Stroke Management",
      "Epilepsy Treatment",
      "Neuro Rehabilitation",
      "Sleep Disorders",
    ],
  },
  {
    id: "4",
    name: "General Medicine",
    description: "Comprehensive internal medicine care for various health conditions.",
    icon: "⚕️",
    image: "https://images.unsplash.com/photo-1579154204601-01d430248e4d?w=800&h=400&fit=crop",
    doctors: 8,
    beds: 30,
    services: [
      "Internal Medicine",
      "Chronic Disease Management",
      "Infection Control",
      "Blood Transfusion",
      "Emergency Care",
    ],
  },
  {
    id: "5",
    name: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents.",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1576091160680-112122c7d029?w=800&h=400&fit=crop",
    doctors: 5,
    beds: 20,
    services: [
      "Child Health",
      "Immunization",
      "Growth & Development",
      "Infectious Diseases",
      "Neonatology",
    ],
  },
  {
    id: "6",
    name: "Gynecology",
    description: "Complete women's health and maternity care with modern facilities.",
    icon: "👩‍⚕️",
    image: "https://images.unsplash.com/photo-1579357572411-b033bbb00c53?w=800&h=400&fit=crop",
    doctors: 4,
    beds: 18,
    services: [
      "Obstetrics",
      "Gynecological Surgery",
      "Infertility Treatment",
      "Normal Delivery",
      "Cesarean Section",
    ],
  },
];
