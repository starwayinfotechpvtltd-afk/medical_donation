"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { X, ZoomIn, LayoutGrid, Tag } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    title: "Modern Hospital Building",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    span: "tall", // card height variant
  },
  {
    id: 2,
    title: "Patient Ward",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1631217b5bafb1b51d5f5ff004a3b814?w=800&h=500&fit=crop",
    span: "normal",
  },
  {
    id: 3,
    title: "Operation Theater",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1576091160395-112122c7d029?w=800&h=500&fit=crop",
    span: "normal",
  },
  {
    id: 4,
    title: "Diagnostic Center",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1584308666744-24d5f400f6f1?w=800&h=600&fit=crop",
    span: "tall",
  },
  {
    id: 5,
    title: "Emergency Department",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
    span: "normal",
  },
  {
    id: 6,
    title: "ICU Unit",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1579154204601-01d430248e4d?w=800&h=600&fit=crop",
    span: "tall",
  },
  {
    id: 7,
    title: "Laboratory",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&h=500&fit=crop",
    span: "normal",
  },
  {
    id: 8,
    title: "Pharmacy Section",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=500&fit=crop",
    span: "normal",
  },
  {
    id: 9,
    title: "Rehabilitation Center",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    span: "tall",
  },
];

const categories = ["All", "Infrastructure", "Facilities", "Medical"];

const categoryColors: Record<string, string> = {
  Infrastructure: "bg-emerald-100 text-emerald-700",
  Facilities:     "bg-teal-100 text-teal-700",
  Medical:        "bg-sky-100 text-sky-700",
};

type GalleryImage = (typeof galleryImages)[0];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-20 overflow-hidden">
          {/* Dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Soft light blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white mb-6">
                  <LayoutGrid className="h-3 w-3" /> Hospital Gallery
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                  A glimpse inside
                  <br />
                  <span className="text-white/80">our world-class</span> facilities
                </h1>
                <p className="text-emerald-100 text-lg max-w-xl leading-relaxed">
                  Explore the spaces where healing happens — from cutting-edge
                  operating theatres to tranquil recovery wards.
                </p>
              </div>

              {/* Right — stat pills */}
              <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end shrink-0">
                {[
                  { n: "9+", l: "Photo Galleries" },
                  { n: "3", l: "Categories" },
                  { n: "10+", l: "Departments" },
                ].map(({ n, l }) => (
                  <div
                    key={l}
                    className="flex items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-3"
                  >
                    <span className="text-2xl font-bold text-white">{n}</span>
                    <span className="text-sm text-emerald-100">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Section label + filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Our Facilities
                </span>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  Discover what's inside
                </h2>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                    }`}
                  >
                    {cat !== "All" && <Tag className="h-3 w-3" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Masonry-style grid */}
            {filteredImages.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                {filteredImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="group relative break-inside-avoid cursor-pointer rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className={`relative w-full bg-slate-100 ${img.span === "tall" ? "h-72" : "h-52"}`}>
                      <Image
                        src={img.image}
                        alt={img.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <span className="text-white text-sm font-semibold">{img.title}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                          <ZoomIn className="h-4 w-4 text-white" />
                        </span>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white">
                      <p className="text-sm font-semibold text-slate-800">{img.title}</p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[img.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {img.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <LayoutGrid className="h-7 w-7 text-emerald-400" />
                </div>
                <p className="text-slate-500 text-lg font-medium">No images in this category.</p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 text-sm text-emerald-600 underline underline-offset-4"
                >
                  View all photos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── LIGHTBOX MODAL ────────────────────────────────────── */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors shadow-sm"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="relative h-72 sm:h-[460px] w-full bg-slate-100">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedImage.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Hospital Facility</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${categoryColors[selectedImage.category] ?? "bg-slate-100 text-slate-600"}`}>
                  {selectedImage.category}
                </span>
              </div>

              {/* Thumbnail strip — navigate between images in same category */}
              <div className="flex gap-2 overflow-x-auto px-6 pb-5 pt-1 scrollbar-hide">
                {galleryImages
                  .filter((img) => img.category === selectedImage.category && img.id !== selectedImage.id)
                  .slice(0, 6)
                  .map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-400 transition-all"
                    >
                      <Image src={img.image} alt={img.title} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}