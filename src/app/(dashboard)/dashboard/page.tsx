"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  BarChart3,
  GraduationCap,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuickAccessCard = {
  labelKey: string;
  descKey: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
};

const institucionCards: QuickAccessCard[] = [
  {
    labelKey: "miProceso",
    descKey: "cardMiProcesoDesc",
    href: "/dashboard/mi-proceso",
    icon: FileText,
    color: "text-sky-600",
    bgGradient: "from-sky-50 to-sky-100/50",
  },
  {
    labelKey: "autoevaluacion",
    descKey: "cardAutoevaluacionDesc",
    href: "/dashboard/autoevaluacion",
    icon: ClipboardCheck,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
  },
  {
    labelKey: "misSolicitudes",
    descKey: "cardMisSolicitudesDesc",
    href: "/dashboard/mis-solicitudes",
    icon: MessageSquare,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
  },
];

const evaluadorCards: QuickAccessCard[] = [
  {
    labelKey: "misCriterios",
    descKey: "cardMisCriteriosDesc",
    href: "/dashboard/mis-criterios",
    icon: ListChecks,
    color: "text-sky-600",
    bgGradient: "from-sky-50 to-sky-100/50",
  },
  {
    labelKey: "evaluarCriterio",
    descKey: "cardEvaluarCriterioDesc",
    href: "/dashboard/evaluar-criterio",
    icon: PenTool,
    color: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
  },
  {
    labelKey: "solicitarInformacion",
    descKey: "cardSolicitarInfoDesc",
    href: "/dashboard/solicitar-informacion",
    icon: Send,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
  },
  {
    labelKey: "visitaInSitu",
    descKey: "cardVisitaDesc",
    href: "/dashboard/visita-in-situ",
    icon: MapPin,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
  },
];

const conaciCards: QuickAccessCard[] = [
  {
    labelKey: "dictamen",
    descKey: "cardDictamenDesc",
    href: "/dashboard/dictamen",
    icon: Scale,
    color: "text-sky-600",
    bgGradient: "from-sky-50 to-sky-100/50",
  },
  {
    labelKey: "resumenFinal",
    descKey: "cardResumenFinalDesc",
    href: "/dashboard/resumen-final",
    icon: FileBarChart,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
  },
  {
    labelKey: "adminDashboard",
    descKey: "cardAdminDashDesc",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    color: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
  },
  {
    labelKey: "gestionProcesos",
    descKey: "cardGestionProcesosDesc",
    href: "/dashboard/admin/procesos",
    icon: Settings,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
  },
];

const cardsByRole: Record<string, QuickAccessCard[]> = {
  INSTITUCION: institucionCards,
  EVALUADOR: evaluadorCards,
  CONACI: conaciCards,
};

function getRoleLabel(role: string) {
  switch (role) {
    case "INSTITUCION": return "Institucion";
    case "EVALUADOR": return "Evaluador";
    case "CONACI": return "CONACI";
    default: return role;
  }
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "INSTITUCION": return "bg-amber-100 text-amber-700 border-amber-200";
    case "EVALUADOR": return "bg-green-100 text-green-700 border-green-200";
    case "CONACI": return "bg-sky-100 text-sky-700 border-sky-200";
    default: return "";
  }
}

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tDash = useTranslations("dashboard");

  const { data: resumen } = useQuery({
    queryKey: ["resumen-proceso-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/resumen-proceso");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
  });

  const { data: procesos } = useQuery({
    queryKey: ["procesos-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards = cardsByRole[user.rolSistema] ?? [];
  const proceso = Array.isArray(procesos) && procesos.length > 0 ? procesos[0] : null;
  const resumenData = resumen?.resumen ?? null;

  return (
    <div className="space-y-6">
      {/* ==================== WELCOME BANNER ==================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-sky-700 p-6 sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-sky-400/20 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {tDash("welcome", { name: user.name.split(" ")[0] })}
              </h1>
              <Badge variant="outline" className={cn("border-white/30 text-white text-xs")}>
                {getRoleLabel(user.rolSistema)}
              </Badge>
            </div>
            <p className="text-sky-100 text-sm">
              {tDash("overview")}
            </p>
          </div>
          <Link href="/dashboard/resumen-ejecutivo">
            <Button className="bg-white text-sky-700 hover:bg-sky-50 shadow-lg">
              <BarChart3 className="mr-2 size-4" />
              {tNav("resumenEjecutivo")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Process Status */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Award className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tDash("processStatus") || "Estado"}</p>
                <p className="text-sm font-semibold">
                  {proceso?.estadoProceso?.replace(/_/g, " ") || "---"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tDash("compliance") || "Cumplimiento"}</p>
                <p className="text-sm font-semibold">
                  {resumenData?.porcentajeCumplimiento != null
                    ? `${resumenData.porcentajeCumplimiento}%`
                    : "---"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tDash("result") || "Resultado"}</p>
                <p className="text-sm font-semibold">
                  {resumenData?.resultadoFinal?.replace(/_/g, " ") || "---"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Score */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tDash("totalDictamen") || "Total Dictamen"}</p>
                <p className="text-sm font-semibold">
                  {resumenData?.totalDictamen != null
                    ? `${resumenData.totalDictamen} / 200`
                    : "---"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== QUICK ACCESS ==================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{tDash("quickAccess") || "Acceso Rapido"}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="group">
                <Card className="border-0 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className={cn("p-0")}>
                    <div className={cn("bg-gradient-to-br p-5", card.bgGradient)}>
                      <div className="flex items-start justify-between">
                        <div className={cn("flex size-11 items-center justify-center rounded-xl bg-white/80 shadow-sm", card.color)}>
                          <Icon className="size-5" />
                        </div>
                        <ArrowRight className="size-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-600" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        {tNav(card.labelKey)}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {tDash(card.descKey)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==================== PROCESS INFO + SCORES ==================== */}
      {(proceso || resumenData) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Current Process */}
          {proceso && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="size-5 text-sky-600" />
                  <h3 className="font-semibold">{tDash("currentProcess") || "Proceso Actual"}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">{tDash("processName") || "Nombre"}</span>
                    <span className="text-sm font-medium">{proceso.nombreProceso}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">{tDash("processStatus") || "Estado"}</span>
                    <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
                      {proceso.estadoProceso?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-dashed">
                    <span className="text-sm text-muted-foreground">{tDash("startDate") || "Fecha Inicio"}</span>
                    <span className="text-sm font-medium">
                      {proceso.fechaInicio ? new Date(proceso.fechaInicio).toLocaleDateString() : "---"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">ID</span>
                    <span className="text-sm font-mono text-muted-foreground">{proceso.idProceso}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score Summary */}
          {resumenData && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="size-5 text-sky-600" />
                  <h3 className="font-semibold">{tDash("scoreSummary") || "Resumen de Puntajes"}</h3>
                </div>
                <div className="space-y-4">
                  {/* Autoevaluacion */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{tNav("autoevaluacion")}</span>
                      <span className="font-semibold">{resumenData.totalAutoevaluacion ?? 0} / 200</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-400 transition-all"
                        style={{ width: `${Math.min(((resumenData.totalAutoevaluacion ?? 0) / 200) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  {/* Evaluador */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{tDash("evaluator") || "Evaluador"}</span>
                      <span className="font-semibold">{resumenData.totalEvaluador ?? 0} / 200</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${Math.min(((resumenData.totalEvaluador ?? 0) / 200) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  {/* Dictamen */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{tNav("dictamen")}</span>
                      <span className="font-semibold">{resumenData.totalDictamen ?? 0} / 200</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-400 transition-all"
                        style={{ width: `${Math.min(((resumenData.totalDictamen ?? 0) / 200) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ==================== COMMON LINKS ==================== */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{tDash("academicData") || "Datos Academicos"}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: tNav("plantaDocente"), href: "/dashboard/planta-docente", color: "text-sky-600 bg-sky-50" },
            { icon: GraduationCap, label: tNav("mapeoDocente"), href: "/dashboard/mapeo-docente", color: "text-violet-600 bg-violet-50" },
            { icon: Building2, label: tNav("matricula"), href: "/dashboard/matricula", color: "text-emerald-600 bg-emerald-50" },
            { icon: TrendingUp, label: tNav("rendimiento"), href: "/dashboard/rendimiento", color: "text-amber-600 bg-amber-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <div className="flex items-center gap-3 rounded-xl border bg-white p-3.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className={cn("flex size-9 items-center justify-center rounded-lg", item.color)}>
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-sky-600 transition-colors">{item.label}</span>
                  <ArrowRight className="ml-auto size-3.5 text-gray-300 group-hover:text-sky-500 transition-all group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
