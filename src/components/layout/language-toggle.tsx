"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "es", label: "Espanol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
] as const;

export function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();

  function handleLocaleChange(newLocale: string) {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  }

  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-7 cursor-pointer"
      >
        <Globe className="size-4" />
        <span className="text-sm">{currentLang.flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
