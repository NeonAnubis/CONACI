"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Shield,
  ClipboardCheck,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

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
    { value: "40+", label: t("statsCriteria") },
    { value: "10", label: t("statsCategories") },
    { value: "3", label: t("statsRoles") },
    { value: "2", label: t("statsInstruments") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-sky-50/80 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700">
              <Image src="/logo.png" alt="CONACI" width={20} height={20} className="h-5 w-auto" />
              CONACI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("heroDescription")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg">
                  {t("ctaLogin")}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  {t("ctaLearnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-sky-50/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-sky-600 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {t("trustedBy")}
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-sky-50 p-3 text-sky-600 transition-colors group-hover:bg-sky-100">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("ctaRegister")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            {t("heroDescription")}
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-sky-500 text-white hover:bg-sky-600"
              >
                {t("ctaRegister")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="CONACI" width={28} height={28} className="h-7 w-auto" />
              <span className="font-semibold text-black">CONACI</span>
              <span className="text-sm text-gray-500">
                - {t("footerDescription")}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CONACI. {t("footerRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
