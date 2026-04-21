"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ClipboardCheck,
  Users,
  Shield,
  BarChart3,
  ArrowRight,
  Globe,
  Award,
  CheckCircle2,
  GraduationCap,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { ImageCarousel } from "@/components/landing/image-carousel";

export default function LandingPage() {
  const t = useTranslations("landing");

  const features = [
    {
      icon: ClipboardCheck,
      title: t("feature1Title"),
      description: t("feature1Description"),
    },
    {
      icon: Users,
      title: t("feature2Title"),
      description: t("feature2Description"),
    },
    {
      icon: Shield,
      title: t("feature3Title"),
      description: t("feature3Description"),
    },
    {
      icon: BarChart3,
      title: t("feature4Title"),
      description: t("feature4Description"),
    },
  ];

  const stats = [
    { value: "40+", label: t("statsCriteria"), icon: CheckCircle2 },
    { value: "10", label: t("statsCategories"), icon: Globe },
    { value: "3", label: t("statsRoles"), icon: Users },
    { value: "2", label: t("statsInstruments"), icon: Award },
  ];

  const workflow = [
    { step: "01", icon: Building2, titleKey: "feature1Title" },
    { step: "02", icon: ClipboardCheck, titleKey: "feature2Title" },
    { step: "03", icon: GraduationCap, titleKey: "feature3Title" },
    { step: "04", icon: TrendingUp, titleKey: "feature4Title" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FB]">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Picture5.png"
            alt="Global Business Network"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Image src="/logo.png" alt="CONACI" width={18} height={18} className="h-4.5 w-auto" />
              CONACI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">
              {t("heroDescription")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/25">
                  {t("ctaLogin")}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  {t("ctaLearnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-black/5 border border-gray-100"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-xl bg-sky-50 p-2.5 text-sky-500">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== IMAGE CAROUSEL ==================== */}
      <ImageCarousel />

      {/* ==================== ABOUT / MISSION ==================== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-600">
              <Award className="size-3.5" />
              {t("aboutLabel") || "About CONACI"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {t("aboutTitle") || "Elevating Academic Excellence Through Accreditation"}
            </h2>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {t("aboutDescription") || "CONACI is the leading accreditation body for international trade programs, ensuring academic quality and professional competence across Latin America."}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, text: t("aboutPoint1") || "Rigorous evaluation by expert panels" },
              { icon: Globe, text: t("aboutPoint2") || "International standards for academic programs" },
              { icon: TrendingUp, text: t("aboutPoint3") || "Continuous improvement framework" },
            ].map((point, i) => {
              const PIcon = point.icon;
              return (
                <div key={i} className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 inline-flex rounded-xl bg-sky-50 p-3 text-sky-600">
                    <PIcon className="size-6" />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{point.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/register">
              <Button size="lg">
                {t("ctaRegister")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-600">
              <Shield className="size-3.5" />
              {t("featuresLabel") || "Platform Features"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {t("trustedBy")}
            </h2>
            <p className="mt-4 text-base text-gray-600">
              {t("featuresSubtitle") || "Everything you need to manage the accreditation process from start to finish"}
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-sky-200 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[4rem] bg-sky-50 transition-colors group-hover:bg-sky-100" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-2xl bg-sky-50 p-3.5 text-sky-600 transition-colors group-hover:bg-sky-500 group-hover:text-white">
                      <Icon className="size-6" />
                    </div>
                    <span className="absolute top-0 right-0 text-5xl font-bold text-gray-100 group-hover:text-sky-100 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-black">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== WORKFLOW ==================== */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0">
          <Image
            src="/Picture3.png"
            alt="Global Network"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/85 to-black/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("workflowTitle") || "Accreditation Process"}
            </h2>
            <p className="mt-4 text-base text-gray-400">
              {t("workflowSubtitle") || "A structured, transparent process from self-assessment to final accreditation"}
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  {/* Connector line */}
                  {i < workflow.length - 1 && (
                    <div className="absolute top-10 left-full hidden w-full lg:block">
                      <div className="h-px w-full bg-gradient-to-r from-sky-500/50 to-transparent" />
                    </div>
                  )}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-sky-500/30">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-sm font-bold text-white">
                        {item.step}
                      </div>
                      <Icon className="size-5 text-sky-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {t(item.titleKey)}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 px-8 py-16 sm:px-16 sm:py-20">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {t("ctaRegister")}
                </h2>
                <p className="mt-4 max-w-md text-base text-sky-100">
                  {t("heroDescription")}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50 shadow-lg">
                      {t("ctaRegister")}
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" className="bg-sky-900 text-white hover:bg-sky-800 border border-sky-700">
                      {t("ctaLogin")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                      <Award className="mb-2 size-6 text-sky-200" />
                      <p className="text-2xl font-bold text-white">200</p>
                      <p className="text-xs text-sky-200">{t("statsMaxScore") || "Maximum Score"}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                      <GraduationCap className="mb-2 size-6 text-sky-200" />
                      <p className="text-2xl font-bold text-white">100%</p>
                      <p className="text-xs text-sky-200">{t("statsDigital") || "Digital Process"}</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                      <Globe className="mb-2 size-6 text-sky-200" />
                      <p className="text-2xl font-bold text-white">2</p>
                      <p className="text-xs text-sky-200">{t("statsInstruments")}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                      <TrendingUp className="mb-2 size-6 text-sky-200" />
                      <p className="text-2xl font-bold text-white">24/7</p>
                      <p className="text-xs text-sky-200">{t("statsAccess") || "Platform Access"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="CONACI" width={36} height={36} className="h-9 w-auto" />
              <div>
                <span className="font-bold text-black">CONACI</span>
                <p className="text-xs text-gray-500">
                  {t("footerDescription")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/login" className="transition-colors hover:text-sky-600">
                {t("navLogin")}
              </Link>
              <Link href="/register" className="transition-colors hover:text-sky-600">
                {t("navRegister")}
              </Link>
              <Link href="#features" className="transition-colors hover:text-sky-600">
                {t("ctaLearnMore")}
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CONACI - Consejo para la Acreditacion del Comercio Internacional. {t("footerRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
