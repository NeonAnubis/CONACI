"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { LanguageToggle } from "@/components/layout/language-toggle";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useCurrentUser();
  const t = useTranslations("nav");

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("home")}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col border-r bg-white transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-14 items-center gap-2 px-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CONACI"
              width={28}
              height={28}
              className="size-7 shrink-0"
            />
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-foreground">CONACI</span>
            )}
          </Link>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>
        <Separator />
        {/* Sidebar nav */}
        <div className="flex-1 overflow-hidden">
          <DashboardSidebar
            rolSistema={user.rolSistema}
            collapsed={sidebarCollapsed}
          />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt="CONACI"
                  width={28}
                  height={28}
                  className="size-7"
                />
                <span className="text-lg font-bold">CONACI</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <DashboardSidebar
            rolSistema={user.rolSistema}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          {/* Mobile logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 lg:hidden"
          >
            <Image
              src="/logo.png"
              alt="CONACI"
              width={24}
              height={24}
              className="size-6"
            />
            <span className="text-base font-bold">CONACI</span>
          </Link>

          <div className="flex-1" />

          {/* Language toggle */}
          <LanguageToggle />

          {/* User menu */}
          <UserMenu />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
