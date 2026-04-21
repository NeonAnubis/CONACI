"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";

export function Navbar() {
  const t = useTranslations("landing");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-[#F8F9FB]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F8F9FB]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="CONACI" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight text-black">
            CONACI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("navLogin")}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              {t("navRegister")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
