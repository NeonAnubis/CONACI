"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  ClipboardCheck,
  MessageSquare,
  ListChecks,
  PenTool,
  Send,
  MapPin,
  Scale,
  FileBarChart,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuickAccessCard = {
  labelKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

const institucionCards: QuickAccessCard[] = [
  {
    labelKey: "miProceso",
    descriptionKey: "myProcesses",
    href: "/dashboard/mi-proceso",
    icon: FileText,
    color: "bg-sky-50 text-sky-600",
  },
  {
    labelKey: "autoevaluacion",
    descriptionKey: "progress",
    href: "/dashboard/autoevaluacion",
    icon: ClipboardCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    labelKey: "misSolicitudes",
    descriptionKey: "pendingTasks",
    href: "/dashboard/mis-solicitudes",
    icon: MessageSquare,
    color: "bg-amber-50 text-amber-600",
  },
];

const evaluadorCards: QuickAccessCard[] = [
  {
    labelKey: "misCriterios",
    descriptionKey: "criteria",
    href: "/dashboard/mis-criterios",
    icon: ListChecks,
    color: "bg-sky-50 text-sky-600",
  },
  {
    labelKey: "evaluarCriterio",
    descriptionKey: "score",
    href: "/dashboard/evaluar-criterio",
    icon: PenTool,
    color: "bg-violet-50 text-violet-600",
  },
  {
    labelKey: "solicitarInformacion",
    descriptionKey: "pendingTasks",
    href: "/dashboard/solicitar-informacion",
    icon: Send,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    labelKey: "visitaInSitu",
    descriptionKey: "stage",
    href: "/dashboard/visita-in-situ",
    icon: MapPin,
    color: "bg-amber-50 text-amber-600",
  },
];

const conaciCards: QuickAccessCard[] = [
  {
    labelKey: "dictamen",
    descriptionKey: "result",
    href: "/dashboard/dictamen",
    icon: Scale,
    color: "bg-sky-50 text-sky-600",
  },
  {
    labelKey: "resumenFinal",
    descriptionKey: "observations",
    href: "/dashboard/resumen-final",
    icon: FileBarChart,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    labelKey: "adminDashboard",
    descriptionKey: "overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    color: "bg-violet-50 text-violet-600",
  },
  {
    labelKey: "gestionProcesos",
    descriptionKey: "process",
    href: "/dashboard/admin/procesos",
    icon: Settings,
    color: "bg-amber-50 text-amber-600",
  },
];

const cardsByRole: Record<string, QuickAccessCard[]> = {
  INSTITUCION: institucionCards,
  EVALUADOR: evaluadorCards,
  CONACI: conaciCards,
};

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tDash = useTranslations("dashboard");

  if (isLoading || !user) {
    return null;
  }

  const cards = cardsByRole[user.rolSistema] ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {tDash("welcome", { name: user.name })}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {tDash("overview")}
        </p>
      </div>

      {/* Quick access cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="group">
              <Card className="transition-shadow hover:shadow-md hover:ring-sky-200">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg",
                        card.color
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="group-hover:text-sky-600 transition-colors">
                        {tNav(card.labelKey)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {tDash(card.descriptionKey)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
