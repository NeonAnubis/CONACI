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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, TrendingUp, FileBarChart, PenTool, Scale } from "lucide-react";
import { toast } from "sonner";

type ResultadoCriterio = {
  id: string;
  idResultado: string;
  nivelAutoevaluacion: number | null;
  nivelEvaluador: number | null;
  nivelDictamen: number | null;
  puntajeAutoevaluacion: number | null;
  puntajeEvaluador: number | null;
  puntajeDictamen: number | null;
  criterio: {
    idCriterio: string;
    numero: number;
    nombre: string;
    valorMaximo: number;
    categoria: {
      nombre: string;
      numero: number;
    };
  };
};

type ResumenProceso = {
  totalAutoevaluacion: number;
  totalEvaluador: number;
  totalDictamen: number;
  porcentajeCumplimiento: number;
  resultadoFinal: string;
};

type Proceso = {
  nombreProceso: string;
  instrumento: { nombre: string; valorMaximo: number };
  institucion: { nombre: string } | null;
  programaAcademico: { nombre: string } | null;
};

type ResumenData = {
  resumen: ResumenProceso | null;
  proceso: Proceso | null;
  resultados: ResultadoCriterio[];
};

type Rendimiento = {
  id: string;
  idCohorte: string;
  ingresaron: number;
  desercion: number;
  rezago: number;
  egresados: number;
  titulados: number;
};

const resultadoColorMap: Record<string, string> = {
  ACREDITACION_CONSOLIDADA: "bg-emerald-100 text-emerald-800",
  ACREDITACION_EN_DESARROLLO: "bg-sky-100 text-sky-800",
  ACREDITACION_CONDICIONADA: "bg-amber-100 text-amber-800",
  NO_ACREDITADO: "bg-red-100 text-red-800",
};

const resultadoKeyMap: Record<string, string> = {
  ACREDITACION_CONSOLIDADA: "acreditacionConsolidada",
  ACREDITACION_EN_DESARROLLO: "acreditacionEnDesarrollo",
  ACREDITACION_CONDICIONADA: "acreditacionCondicionada",
  NO_ACREDITADO: "noAcreditado",
};

export default function ResumenEjecutivoPage() {
  const t = useTranslations("resumen");
  const tResults = useTranslations("results");
  const tCommon = useTranslations("common");

  const { data: resumenData, isLoading: loadingResumen } = useQuery<ResumenData>({
    queryKey: ["resumen-proceso"],
    queryFn: async () => {
      const res = await fetch("/api/resumen-proceso");
      if (!res.ok) throw new Error("Failed to fetch resumen");
      return res.json();
    },
    meta: {
      onError: () => toast.error(tCommon("error")),
    },
  });

  const { data: rendimientos, isLoading: loadingRendimiento } = useQuery<Rendimiento[]>({
    queryKey: ["rendimiento"],
    queryFn: async () => {
      const res = await fetch("/api/rendimiento");
      if (!res.ok) throw new Error("Failed to fetch rendimiento");
      return res.json();
    },
  });

  const resumen = resumenData?.resumen;
  const proceso = resumenData?.proceso;
  const resultados = resumenData?.resultados ?? [];

  if (loadingResumen) {
    return <ResumenSkeleton />;
  }

  if (!proceso || !resumen) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">{t("noProcess")}</p>
      </div>
    );
  }

  const valorMaximo = proceso.instrumento?.valorMaximo ?? 200;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{proceso.nombreProceso}</p>
      </div>

      {/* Row 1: 2 large KPI cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-500" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("resultadoFinal")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              className={resultadoColorMap[resumen.resultadoFinal] ?? "bg-gray-100 text-gray-800"}
            >
              {tResults(resultadoKeyMap[resumen.resultadoFinal] ?? "noAcreditado")}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-500" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("porcentajeCumplimiento")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen.porcentajeCumplimiento.toFixed(1)}%</p>
            <Progress value={resumen.porcentajeCumplimiento} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: 3 KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          icon={<FileBarChart className="h-5 w-5 text-sky-500" />}
          label={t("totalAutoevaluacion")}
          value={resumen.totalAutoevaluacion}
          maxValue={valorMaximo}
          ofLabel={t("of")}
        />
        <KPICard
          icon={<PenTool className="h-5 w-5 text-emerald-500" />}
          label={t("totalEvaluador")}
          value={resumen.totalEvaluador}
          maxValue={valorMaximo}
          ofLabel={t("of")}
        />
        <KPICard
          icon={<Scale className="h-5 w-5 text-violet-500" />}
          label={t("totalDictamen")}
          value={resumen.totalDictamen}
          maxValue={valorMaximo}
          ofLabel={t("of")}
        />
      </div>

      {/* Row 3: Resultados por criterio */}
      <Card>
        <CardHeader>
          <CardTitle>{t("resultadosPorCriterio")}</CardTitle>
        </CardHeader>
        <CardContent>
          {resultados.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t("noData")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("criterio")}</TableHead>
                  <TableHead className="text-center">{t("nivelAuto")}</TableHead>
                  <TableHead className="text-center">{t("nivelEval")}</TableHead>
                  <TableHead className="text-center">{t("nivelDict")}</TableHead>
                  <TableHead className="text-center">{t("puntaje")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{r.criterio.idCriterio}</span>
                        <span className="ml-2 text-muted-foreground">{r.criterio.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{r.nivelAutoevaluacion ?? "-"}</TableCell>
                    <TableCell className="text-center">{r.nivelEvaluador ?? "-"}</TableCell>
                    <TableCell className="text-center">{r.nivelDictamen ?? "-"}</TableCell>
                    <TableCell className="text-center font-medium">
                      {r.puntajeDictamen ?? r.puntajeEvaluador ?? r.puntajeAutoevaluacion ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Row 4: Rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle>{t("rendimiento")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRendimiento ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !rendimientos || rendimientos.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t("noData")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("cohorte")}</TableHead>
                  <TableHead>{t("tasaDesercion")}</TableHead>
                  <TableHead>{t("eficienciaTerminal")}</TableHead>
                  <TableHead>{t("tasaTitulacion")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rendimientos.map((r) => {
                  const tasaDesercion = r.ingresaron > 0
                    ? (r.desercion / r.ingresaron) * 100
                    : 0;
                  const eficiencia = r.ingresaron > 0
                    ? (r.egresados / r.ingresaron) * 100
                    : 0;
                  const tasaTitulacion = r.ingresaron > 0
                    ? (r.titulados / r.ingresaron) * 100
                    : 0;

                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.idCohorte}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={tasaDesercion} className="w-24 [&>div]:bg-red-500" />
                          <span className="text-sm">{tasaDesercion.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={eficiencia} className="w-24 [&>div]:bg-emerald-500" />
                          <span className="text-sm">{eficiencia.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={tasaTitulacion} className="w-24" />
                          <span className="text-sm">{tasaTitulacion.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  maxValue,
  ofLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  ofLabel: string;
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
        <p className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {ofLabel} {maxValue}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

function ResumenSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}
