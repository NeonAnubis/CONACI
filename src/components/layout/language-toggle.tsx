"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "es", label: "Español", image: "/spain.jpg" },
  { code: "en", label: "English", image: "/us.jpg" },
] as const;

function setCookie(name: string, value: string) {
  globalThis.document.cookie = `${name}=${value};path=/;max-age=31536000`;
}

export function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();

  const handleLocaleChange = useCallback((newLocale: string) => {
    setCookie("locale", newLocale);
    router.refresh();
  }, [router]);

  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-8 cursor-pointer"
      >
        <Image
          src={currentLang.image}
          alt={currentLang.label}
          width={20}
          height={14}
          className="h-3.5 w-5 object-cover"
        />
        <span className="text-xs uppercase">{currentLang.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <Image
              src={lang.image}
              alt={lang.label}
              width={20}
              height={14}
              className="mr-2 h-3.5 w-5 rounded-sm object-cover"
            />
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
