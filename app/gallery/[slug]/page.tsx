"use client";

import { useEffect, useState, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Download,
  ImageIcon,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react";
import {
  galleryApi,
  getMediaUrl,
  type GalleryCategory,
  type GalleryMedia,
} from "@/lib/gallery-api";

// Fallback demo media per category in case DB is still empty
const DEMO_CATEGORY_DATA: Record<
  string,
  { category: GalleryCategory; media: GalleryMedia[] }
> = {
  "infrastructure-campus": {
    category: {
      id: 1,
      name: "Infrastructure & Campus",
      slug: "infrastructure-campus",
      description:
        "Modern architectural design, sustainable hospital campus, smart patient waiting lounges, and green healing spaces.",
      media_count: 8,
    },
    media: [
      { id: 101, category_id: 1, title: "Main Hospital Exterior", type: "photo", url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=85" },
      { id: 102, category_id: 1, title: "Modern Atrium & Reception", type: "photo", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=85" },
      { id: 103, category_id: 1, title: "Hospital Gardens & Healing Walkway", type: "photo", url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=85" },
      { id: 104, category_id: 1, title: "Night View of Main Medical Tower", type: "photo", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85" },
      { id: 105, category_id: 1, title: "Patient Welcome Lounge", type: "photo", url: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&q=85" },
      { id: 106, category_id: 1, title: "Dedicated Parking & Valet Bay", type: "photo", url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=85" },
      { id: 107, category_id: 1, title: "Cafeteria & Organic Dining", type: "photo", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&q=85" },
      { id: 108, category_id: 1, title: "Conference & Academic Auditorium", type: "photo", url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&q=85" },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryGalleryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [mediaList, setMediaList] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await galleryApi.getCategoryMedia(slug);
      setCategory(res.category);
      setMediaList(res.media);
    } catch {
      // Check fallback demo data
      if (DEMO_CATEGORY_DATA[slug]) {
        setCategory(DEMO_CATEGORY_DATA[slug].category);
        setMediaList(DEMO_CATEGORY_DATA[slug].media);
      } else {
        // Generic fallback with nice placeholder content
        const formattedTitle = slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        setCategory({
          id: 999,
          name: formattedTitle,
          slug,
          description: `Comprehensive photo collection for ${formattedTitle} department and facilities.`,
          media_count: 6,
        });
        setMediaList([
          { id: 1, category_id: 999, title: `${formattedTitle} - Overview`, type: "photo", url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=85" },
          { id: 2, category_id: 999, title: `${formattedTitle} - Facility Detail`, type: "photo", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=85" },
          { id: 3, category_id: 999, title: `${formattedTitle} - Patient Area`, type: "photo", url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=85" },
          { id: 4, category_id: 999, title: `${formattedTitle} - Medical Equipment`, type: "photo", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85" },
          { id: 5, category_id: 999, title: `${formattedTitle} - Clinical Suite`, type: "photo", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=85" },
          { id: 6, category_id: 999, title: `${formattedTitle} - Recovery Wing`, type: "photo", url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=85" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaList.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < mediaList.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, mediaList.length]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/60 pb-28 pt-28">
        {/* ── HEADER BREADCRUMB & INTRO ───────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-emerald-600" />
              Back to All Categories
            </Link>
          </div>

          {/* Category Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-3">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Category Collection
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {category ? category.name : "Category Gallery"}
                </h1>
                {category?.description && (
                  <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Stats badge */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {mediaList.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {mediaList.length === 1 ? "Photo in album" : "Photos in album"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PHOTO GRID ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : mediaList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {mediaList.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Photo container */}
                  <div className="relative h-64 w-full">
                    <Image
                      src={getMediaUrl(item.url)}
                      alt={item.title || category?.name || "Gallery Photo"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      {/* Top Action */}
                      <div className="flex justify-end">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Bottom Title */}
                      <div>
                        {item.title && (
                          <p className="text-sm font-semibold text-white drop-shadow-md line-clamp-1">
                            {item.title}
                          </p>
                        )}
                        <span className="text-xs text-emerald-300 font-medium">
                          Click to enlarge
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption footer */}
                  {item.title && (
                    <div className="bg-white p-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No photos in this category yet
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                Photos for this category will be uploaded soon by hospital administrators.
              </p>
              <Link
                href="/gallery"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse Other Categories
              </Link>
            </div>
          )}
        </section>

        {/* ── LIGHTBOX MODAL ─────────────────────────────────────── */}
        {lightboxIndex !== null && mediaList[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Lightbox Wrapper */}
            <div
              className="relative flex flex-col items-center justify-center max-w-5xl w-full h-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls Bar */}
              <div className="flex w-full items-center justify-between py-3 text-white">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                    {lightboxIndex + 1} / {mediaList.length}
                  </span>
                  {mediaList[lightboxIndex].title && (
                    <span className="font-semibold text-sm sm:text-base drop-shadow-sm text-slate-200">
                      {mediaList[lightboxIndex].title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition backdrop-blur-md"
                    title="Close (Esc)"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-2xl">
                <div className="relative w-full h-full max-h-[70vh]">
                  <Image
                    src={getMediaUrl(mediaList[lightboxIndex].url)}
                    alt={mediaList[lightboxIndex].title || "Full size photo"}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Left navigation arrow */}
                {mediaList.length > 1 && (
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : mediaList.length - 1
                      )
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/70 hover:scale-110 transition backdrop-blur-md"
                    title="Previous (Left Arrow)"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Right navigation arrow */}
                {mediaList.length > 1 && (
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev !== null && prev < mediaList.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/70 hover:scale-110 transition backdrop-blur-md"
                    title="Next (Right Arrow)"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Bottom Thumbnail Strip */}
              {mediaList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto w-full max-w-full py-3 px-2 scrollbar-hide justify-center mt-2">
                  {mediaList.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        lightboxIndex === idx
                          ? "border-emerald-400 scale-105 shadow-lg"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={getMediaUrl(m.url)}
                        alt={m.title || "Thumbnail"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
