"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, Building2, GraduationCap, Wrench } from "lucide-react";

type Proceso = {
  id: string;
  idProceso: string;
  nombreProceso: string;
  estadoProceso: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  instrumento: { id: string; nombre: string; tipo: string } | null;
  institucion: { id: string; nombre: string; campus: string | null } | null;
  programaAcademico: { id: string; nombre: string; tipoPrograma: string | null } | null;
};

const estadoMap: Record<string, string> = {
  EN_PREPARACION: "enPreparacion",
  EN_AUTOEVALUACION: "enAutoevaluacion",
  EN_EVALUACION: "enEvaluacion",
  EN_DICTAMEN: "enDictamen",
  COMPLETADO: "completado",
};

const estadoVariant: Record<string, "default" | "secondary" | "outline"> = {
  EN_PREPARACION: "outline",
  EN_AUTOEVALUACION: "secondary",
  EN_EVALUACION: "secondary",
  EN_DICTAMEN: "secondary",
  COMPLETADO: "default",
};

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MiProcesoPage() {
  const { user } = useCurrentUser();
  const t = useTranslations("dashboard");
  const tProcess = useTranslations("process");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const { data: procesos, isLoading, error } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Error fetching procesos");
      return res.json();
    },
    enabled: !!user,
  });

  const proceso = procesos?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("miProceso")}</h1>
        <p className="mt-1 text-muted-foreground">{t("myProcesses")}</p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && !proceso && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noProcesses")}
          </CardContent>
        </Card>
      )}

      {proceso && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-sky-500" />
              {proceso.nombreProceso}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {t("process")} ID
                  </dt>
                  <dd className="mt-0.5 font-medium">{proceso.idProceso}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-4" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {tCommon("status")}
                  </dt>
                  <dd className="mt-1">
                    <Badge variant={estadoVariant[proceso.estadoProceso] ?? "outline"}>
                      {tProcess(estadoMap[proceso.estadoProceso] ?? "enPreparacion")}
                    </Badge>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {t("instrument")}
                  </dt>
                  <dd className="mt-0.5">{proceso.instrumento?.nombre ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {t("institution")}
                  </dt>
                  <dd className="mt-0.5">{proceso.institucion?.nombre ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {t("program")}
                  </dt>
                  <dd className="mt-0.5">{proceso.programaAcademico?.nombre ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {tCommon("date")}
                  </dt>
                  <dd className="mt-0.5">
                    {proceso.fechaInicio
                      ? new Date(proceso.fechaInicio).toLocaleDateString()
                      : "-"}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
