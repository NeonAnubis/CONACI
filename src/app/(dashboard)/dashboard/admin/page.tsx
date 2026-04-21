"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, Building2, Users, Activity } from "lucide-react";
import { toast } from "sonner";

type Proceso = {
  id: string;
  idProceso: string;
  nombreProceso: string;
  estadoProceso: string;
  instrumento: { nombre: string } | null;
  institucion: { nombre: string } | null;
};

type Usuario = {
  id: string;
  name: string;
  email: string;
  rolSistema: string;
  subRolConaci: string | null;
  activo: boolean;
};

type Institucion = {
  id: string;
  nombre: string;
};

const estadoColors: Record<string, string> = {
  EN_PREPARACION: "bg-gray-100 text-gray-700",
  EN_AUTOEVALUACION: "bg-sky-100 text-sky-700",
  EN_EVALUACION: "bg-amber-100 text-amber-700",
  EN_DICTAMEN: "bg-violet-100 text-violet-700",
  COMPLETADO: "bg-emerald-100 text-emerald-700",
};

const estadoKeyMap: Record<string, string> = {
  EN_PREPARACION: "enPreparacion",
  EN_AUTOEVALUACION: "enAutoevaluacion",
  EN_EVALUACION: "enEvaluacion",
  EN_DICTAMEN: "enDictamen",
  COMPLETADO: "completado",
};

const rolColors: Record<string, string> = {
  CONACI: "bg-sky-100 text-sky-700",
  EVALUADOR: "bg-emerald-100 text-emerald-700",
  INSTITUCION: "bg-amber-100 text-amber-700",
};

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const tProcess = useTranslations("process");
  const tRoles = useTranslations("roles");
  const tCommon = useTranslations("common");

  const { data: procesos, isLoading: loadingProcesos } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    meta: { onError: () => toast.error(t("errorLoading")) },
  });

  const { data: usuarios, isLoading: loadingUsuarios } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: instituciones, isLoading: loadingInstituciones } = useQuery<Institucion[]>({
    queryKey: ["instituciones"],
    queryFn: async () => {
      const res = await fetch("/api/instituciones");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const isLoading = loadingProcesos || loadingUsuarios || loadingInstituciones;

  const totalProcesos = procesos?.length ?? 0;
  const totalInstituciones = instituciones?.length ?? 0;
  const totalUsuarios = usuarios?.length ?? 0;
  const procesosActivos = procesos?.filter(
    (p) => p.estadoProceso !== "COMPLETADO"
  ).length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FolderOpen className="h-5 w-5 text-sky-500" />}
          label={t("totalProcesos")}
          value={totalProcesos}
          loading={isLoading}
        />
        <StatCard
          icon={<Building2 className="h-5 w-5 text-emerald-500" />}
          label={t("totalInstituciones")}
          value={totalInstituciones}
          loading={isLoading}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-violet-500" />}
          label={t("totalUsuarios")}
          value={totalUsuarios}
          loading={isLoading}
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-amber-500" />}
          label={t("procesosActivos")}
          value={procesosActivos}
          loading={isLoading}
        />
      </div>

      {/* Processes table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allProcesses")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProcesos ? (
            <TableSkeleton rows={3} cols={4} />
          ) : !procesos || procesos.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t("noProcesses")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("processId")}</TableHead>
                  <TableHead>{t("processName")}</TableHead>
                  <TableHead>{t("instrument")}</TableHead>
                  <TableHead>{t("institution")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procesos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.idProceso}</TableCell>
                    <TableCell>{p.nombreProceso}</TableCell>
                    <TableCell>{p.instrumento?.nombre ?? "-"}</TableCell>
                    <TableCell>{p.institucion?.nombre ?? "-"}</TableCell>
                    <TableCell>
                      <Badge className={estadoColors[p.estadoProceso] ?? ""}>
                        {tProcess(estadoKeyMap[p.estadoProceso] ?? "enPreparacion")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingUsuarios ? (
            <TableSkeleton rows={3} cols={4} />
          ) : !usuarios || usuarios.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t("noUsers")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge className={rolColors[u.rolSistema] ?? ""}>
                        {tRoles(u.rolSistema.toLowerCase() as "conaci" | "evaluador" | "institucion")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                        {u.activo ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
