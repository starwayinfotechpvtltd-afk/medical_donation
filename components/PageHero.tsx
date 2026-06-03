import React from "react";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    title: string;
    description?: string;
    badge?: string;
    icon?: React.ElementType;
    breadcrumb?: BreadcrumbItem[];
}

export default function PageHero({
    title,
    description,
    badge,
    icon: Icon = LayoutGrid,
    breadcrumb,
}: PageHeroProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-24 lg:py-20">
            {/* Dot Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Glow Effects */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

            {/* Extra Gradient Ring */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center lg:items-start">
                {/* Breadcrumb */}
                {
                    breadcrumb && (
                        <div className="mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm">
                            {breadcrumb.map((item, index) => (
                                <React.Fragment key={item.label}>
                                    {index > 0 && (
                                        <ChevronRight className="h-4 w-4 text-white/50" />
                                    )}

                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="text-white/70 transition hover:text-white"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-white">
                                            {item.label}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )
                }

                {/* Badge */}
                {badge && (
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md border border-white/10">
                        <Icon className="h-4 w-4" />
                        {badge}
                    </div>
                )}

                <div className="max-w-7xl">
                    <h1 className="text-center lg:text-left text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-center lg:text-left mt-2 max-w-7xl text-lg leading-relaxed text-emerald-50 md:text-xl">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}