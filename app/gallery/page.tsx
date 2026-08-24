"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  LayoutGrid,
  Search,
  ArrowRight,
  ImageIcon,
  Sparkles,
  Layers,
  Building2,
  RefreshCw,
} from "lucide-react";
import {
  galleryApi,
  getMediaUrl,
  type GalleryCategory,
} from "@/lib/gallery-api";

// Fallback initial demo categories in case database is empty or not yet migrated
const DEMO_CATEGORIES: GalleryCategory[] = [
  {
    id: 1,
    name: "Infrastructure & Campus",
    slug: "infrastructure-campus",
    description: "Modern architectural design, sustainable hospital campus, and smart facilities.",
    media_count: 34,
    photo_count: 34,
    covers: [
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    ],
  },
  {
    id: 2,
    name: "Operation Theatres & ICU",
    slug: "operation-theatres-icu",
    description: "State-of-the-art surgical suites equipped with modern robotic and laparoscopic tools.",
    media_count: 18,
    photo_count: 18,
    covers: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",
      "https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&q=80",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    ],
  },
  {
    id: 3,
    name: "Diagnostic & Radiology Lab",
    slug: "diagnostic-radiology-lab",
    description: "High-precision MRI, CT-Scan, automated pathology and molecular diagnosis laboratories.",
    media_count: 26,
    photo_count: 26,
    covers: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
      "https://images.unsplash.com/photo-1579154204601-01d430248e4d?w=800&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
    ],
  },
  {
    id: 4,
    name: "Patient Rooms & Suites",
    slug: "patient-rooms-suites",
    description: "Comfortable, hygienic private recovery rooms and specialized pediatric care wards.",
    media_count: 42,
    photo_count: 42,
    covers: [
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&q=80",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    ],
  },
  {
    id: 5,
    name: "Emergency & Trauma Care",
    slug: "emergency-trauma-care",
    description: "24/7 fully-equipped critical trauma response units and mobile ambulance fleet.",
    media_count: 15,
    photo_count: 15,
    covers: [
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    ],
  },
  {
    id: 6,
    name: "Pharmacy & Wellness",
    slug: "pharmacy-wellness",
    description: "In-house automated dispensary and physiotherapy recovery centres.",
    media_count: 22,
    photo_count: 22,
    covers: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160395-112122c7d029?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    ],
  },
];

export default function GalleryPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(DEMO_CATEGORIES);
      }
    } catch {
      // Fallback gracefully to demo categories if server/DB is not migrated yet
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/60 pb-28 pt-28">
        {/* ── HERO BANNER ────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
            {/* Ambient background glow */}
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

            {/* Subtle grid pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hospital Visual Tour
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Hospital <span className="text-emerald-400">Photo Gallery</span>
                </h1>
                <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
                  Explore our modern medical campus, specialized care units, advanced laboratories, and patient healing environments through curated collections.
                </p>
              </div>

              {/* Quick stats badge */}
              <div className="flex items-center gap-4 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-4 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/30 text-emerald-300">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {categories.length}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Categories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTROLS / SEARCH BAR ──────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories (e.g. ICU, Lab, Campus)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Total items note */}
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2">
              Showing {filteredCategories.length} {filteredCategories.length === 1 ? "Category" : "Categories"}
            </div>
          </div>
        </section>

        {/* ── CATEGORY MOSAIC GRID (MATCHING REFERENCE IMAGE) ───── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 animate-pulse shadow-sm"
                >
                  <div className="h-44 w-full rounded-xl bg-slate-200" />
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-1/4 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => {
                const covers = category.covers || [];
                const count = category.media_count || covers.length || 0;

                return (
                  <Link
                    key={category.id}
                    href={`/gallery/${category.slug}`}
                    className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  >
                    {/* MOSAIC IMAGE THUMBNAIL (Collage matching reference photo) */}
                    <div className="relative p-2.5 pb-0">
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                        {covers.length >= 3 ? (
                          // 3+ Images: 2 stacked on left, 1 tall on right (Exact layout from reference)
                          <div className="grid h-full w-full grid-cols-12 gap-1.5 p-1 bg-slate-50">
                            {/* Left Column (2 small stacked images) */}
                            <div className="col-span-5 flex flex-col gap-1.5 h-full">
                              <div className="relative flex-1 rounded-lg overflow-hidden bg-slate-200">
                                <Image
                                  src={getMediaUrl(covers[0])}
                                  alt={category.name}
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="relative flex-1 rounded-lg overflow-hidden bg-slate-200">
                                <Image
                                  src={getMediaUrl(covers[1])}
                                  alt={category.name}
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </div>

                            {/* Right Column (1 large prominent vertical image) */}
                            <div className="col-span-7 relative h-full rounded-lg overflow-hidden bg-slate-200">
                              <Image
                                src={getMediaUrl(covers[2])}
                                alt={category.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        ) : covers.length === 2 ? (
                          // 2 Images: Split side by side
                          <div className="grid h-full w-full grid-cols-2 gap-1.5 p-1 bg-slate-50">
                            <div className="relative h-full rounded-lg overflow-hidden bg-slate-200">
                              <Image
                                src={getMediaUrl(covers[0])}
                                alt={category.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="relative h-full rounded-lg overflow-hidden bg-slate-200">
                              <Image
                                src={getMediaUrl(covers[1])}
                                alt={category.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        ) : covers.length === 1 ? (
                          // 1 Image: Full cover
                          <div className="relative h-full w-full">
                            <Image
                              src={getMediaUrl(covers[0])}
                              alt={category.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          // Empty state placeholder
                          <div className="flex h-full w-full flex-col items-center justify-center bg-emerald-50/60 text-emerald-600">
                            <ImageIcon className="h-8 w-8 stroke-[1.5] opacity-70 mb-1" />
                            <span className="text-xs font-medium text-emerald-800">
                              Gallery Collection
                            </span>
                          </div>
                        )}

                        {/* Hover subtle view overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <ArrowRight className="h-4 w-4 text-emerald-600" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TEXT INFORMATION (Title & Count matching reference style) */}
                    <div className="p-4 pt-3 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {count} {count === 1 ? "Photo" : "Photos"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No matching categories found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                We couldn&apos;t find any gallery categories matching &quot;{search}&quot;.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Search
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}