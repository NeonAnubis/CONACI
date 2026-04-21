"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  GraduationCap,
  FileText,
  ClipboardCheck,
  MessageSquare,
  ListChecks,
  PenTool,
  Send,
  MapPin,
  Scale,
  FileBarChart,
  Settings,
  UserCog,
  UserCheck,
  Users,
  BookOpen,
  School,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  roles: ("INSTITUCION" | "EVALUADOR" | "CONACI")[];
};

type NavSection = {
  titleKey: string | null;
  items: NavItem[];
  roles: ("INSTITUCION" | "EVALUADOR" | "CONACI")[];
};

const navSections: NavSection[] = [
  {
    titleKey: null,
    roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
    items: [
      {
        labelKey: "dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
      {
        labelKey: "resumenEjecutivo",
        href: "/dashboard/resumen-ejecutivo",
        icon: BarChart3,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
    ],
  },
  {
    titleKey: "informacion",
    roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
    items: [
      {
        labelKey: "miInstitucion",
        href: "/dashboard/mi-institucion",
        icon: Building2,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
      {
        labelKey: "miPrograma",
        href: "/dashboard/mi-programa",
        icon: GraduationCap,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
    ],
  },
  {
    titleKey: "miProceso",
    roles: ["INSTITUCION"],
    items: [
      {
        labelKey: "miProceso",
        href: "/dashboard/mi-proceso",
        icon: FileText,
        roles: ["INSTITUCION"],
      },
      {
        labelKey: "autoevaluacion",
        href: "/dashboard/autoevaluacion",
        icon: ClipboardCheck,
        roles: ["INSTITUCION"],
      },
      {
        labelKey: "misSolicitudes",
        href: "/dashboard/mis-solicitudes",
        icon: MessageSquare,
        roles: ["INSTITUCION"],
      },
    ],
  },
  {
    titleKey: "evaluacion",
    roles: ["EVALUADOR"],
    items: [
      {
        labelKey: "misCriterios",
        href: "/dashboard/mis-criterios",
        icon: ListChecks,
        roles: ["EVALUADOR"],
      },
      {
        labelKey: "evaluarCriterio",
        href: "/dashboard/evaluar-criterio",
        icon: PenTool,
        roles: ["EVALUADOR"],
      },
      {
        labelKey: "solicitarInformacion",
        href: "/dashboard/solicitar-informacion",
        icon: Send,
        roles: ["EVALUADOR"],
      },
      {
        labelKey: "visitaInSitu",
        href: "/dashboard/visita-in-situ",
        icon: MapPin,
        roles: ["EVALUADOR"],
      },
    ],
  },
  {
    titleKey: "dictamen",
    roles: ["CONACI"],
    items: [
      {
        labelKey: "dictamen",
        href: "/dashboard/dictamen",
        icon: Scale,
        roles: ["CONACI"],
      },
      {
        labelKey: "resumenFinal",
        href: "/dashboard/resumen-final",
        icon: FileBarChart,
        roles: ["CONACI"],
      },
    ],
  },
  {
    titleKey: "administracion",
    roles: ["CONACI"],
    items: [
      {
        labelKey: "adminDashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
        roles: ["CONACI"],
      },
      {
        labelKey: "gestionProcesos",
        href: "/dashboard/admin/procesos",
        icon: Settings,
        roles: ["CONACI"],
      },
      {
        labelKey: "gestionUsuarios",
        href: "/dashboard/admin/usuarios",
        icon: UserCog,
        roles: ["CONACI"],
      },
      {
        labelKey: "gestionEvaluadores",
        href: "/dashboard/admin/evaluadores",
        icon: UserCheck,
        roles: ["CONACI"],
      },
    ],
  },
  {
    titleKey: "datosAcademicos",
    roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
    items: [
      {
        labelKey: "plantaDocente",
        href: "/dashboard/planta-docente",
        icon: Users,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
      {
        labelKey: "mapeoDocente",
        href: "/dashboard/mapeo-docente",
        icon: BookOpen,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
      {
        labelKey: "matricula",
        href: "/dashboard/matricula",
        icon: School,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
      {
        labelKey: "rendimiento",
        href: "/dashboard/rendimiento",
        icon: TrendingUp,
        roles: ["INSTITUCION", "EVALUADOR", "CONACI"],
      },
    ],
  },
];

type DashboardSidebarProps = {
  rolSistema: string;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function DashboardSidebar({
  rolSistema,
  collapsed = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const filteredSections = navSections
    .filter((section) =>
      section.roles.includes(rolSistema as "INSTITUCION" | "EVALUADOR" | "CONACI")
    )
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.roles.includes(rolSistema as "INSTITUCION" | "EVALUADOR" | "CONACI")
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-3">
        {filteredSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={cn(sectionIdx > 0 && "mt-4")}>
            {section.titleKey && !collapsed && (
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(section.titleKey)}
              </p>
            )}
            {section.titleKey && collapsed && (
              <div className="mx-auto mb-1 h-px w-6 bg-border" />
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sky-50 text-sky-600"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? t(item.labelKey) : undefined}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive && "text-sky-500"
                        )}
                      />
                      {!collapsed && <span>{t(item.labelKey)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}
