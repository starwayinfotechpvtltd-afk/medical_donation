"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { X } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    title: "Modern Hospital Building",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Patient Ward",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1631217b5bafb1b51d5f5ff004a3b814?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Operation Theater",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1576091160395-112122c7d029?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Diagnostic Center",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1584308666744-24d5f400f6f1?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Emergency Department",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1576091160675-112122c7d029?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "ICU Unit",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1579154204601-01d430248e4d?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    title: "Laboratory",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1576091160399-112122c7d029?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    title: "Pharmacy Section",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1576091160365-112122c7d029?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    title: "Rehabilitation Center",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1576091160386-112122c7d029?w=600&h=400&fit=crop",
  },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);

  const categories = ["All", "Infrastructure", "Facilities", "Medical"];

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 text-balance">
              Hospital Gallery
            </h1>
            <p className="text-xl text-slate-700 max-w-2xl">
              Explore our state-of-the-art facilities and infrastructure
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Our Facilities"
              description="Discover the modern infrastructure and equipment of our hospital"
              centered
            />

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Image Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="relative h-56 bg-slate-200">
                    <Image
                      src={img.image}
                      alt={img.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-semibold transition-opacity">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-slate-900">{img.title}</h3>
                    <p className="text-sm text-emerald-500">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No images found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="relative h-96 md:h-[500px] bg-slate-200 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 bg-white rounded-lg p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedImage.title}</h3>
                <p className="text-emerald-500 font-semibold">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
