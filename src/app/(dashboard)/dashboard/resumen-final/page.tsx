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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileBarChart, TrendingUp, Award } from "lucide-react";

type ResumenData = {
  resumen: {
    id: string;
    idResumen: string;
    totalAutoevaluacion: number;
    totalEvaluador: number;
    totalDictamen: number;
    diferenciaTotalAutoDict: number;
    porcentajeCumplimiento: number;
    resultadoFinal: string;
  } | null;
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
    estadoProceso: string;
    instrumento: { nombre: string; valorMaximo: number } | null;
    institucion: { nombre: string } | null;
    programaAcademico: { nombre: string } | null;
  } | null;
  resultados: {
    id: string;
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
      categoria: { nombre: string; numero: number };
    };
  }[];
};

const resultadoMap: Record<string, string> = {
  ACREDITACION_CONSOLIDADA: "acreditacionConsolidada",
  ACREDITACION_EN_DESARROLLO: "acreditacionEnDesarrollo",
  ACREDITACION_CONDICIONADA: "acreditacionCondicionada",
  NO_ACREDITADO: "noAcreditado",
};

const resultadoVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACREDITACION_CONSOLIDADA: "default",
  ACREDITACION_EN_DESARROLLO: "secondary",
  ACREDITACION_CONDICIONADA: "outline",
  NO_ACREDITADO: "destructive",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function ResumenFinalPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");
  const tResults = useTranslations("results");

  const { data, isLoading, error } = useQuery<ResumenData>({
    queryKey: ["resumen-proceso"],
    queryFn: async () => {
      const res = await fetch("/api/resumen-proceso");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const resumen = data?.resumen;
  const proceso = data?.proceso;
  const resultados = data?.resultados ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("resumenFinal")}</h1>
        <p className="mt-1 text-muted-foreground">
          {proceso?.nombreProceso ?? t("observations")}
        </p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && !resumen && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("noResults")}
          </CardContent>
        </Card>
      )}

      {resumen && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Award className="size-4 text-sky-500" />
                  {t("result")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={resultadoVariant[resumen.resultadoFinal] ?? "outline"}>
                  {tResults(resultadoMap[resumen.resultadoFinal] ?? "noAcreditado")}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4 text-sky-500" />
                  {t("progress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumen.porcentajeCumplimiento.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{tCommon("total")} Auto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumen.totalAutoevaluacion.toFixed(1)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{tCommon("total")} Dictamen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumen.totalDictamen.toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Totals detail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="size-5 text-sky-500" />
                {tCommon("details")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {tCommon("total")} Autoevaluacion
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{resumen.totalAutoevaluacion.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {tCommon("total")} Evaluador
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{resumen.totalEvaluador.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {tCommon("total")} Dictamen
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{resumen.totalDictamen.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    Diferencia Auto-Dictamen
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{resumen.diferenciaTotalAutoDict.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    Porcentaje Cumplimiento
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{resumen.porcentajeCumplimiento.toFixed(2)}%</dd>
                </div>
                {proceso?.instrumento && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground uppercase">
                      Valor Maximo Instrumento
                    </dt>
                    <dd className="mt-1 text-lg font-semibold">{proceso.instrumento.valorMaximo}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Detailed results table */}
          {resultados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("criteria")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("criteria")}</TableHead>
                      <TableHead className="text-center">Auto</TableHead>
                      <TableHead className="text-center">Evaluador</TableHead>
                      <TableHead className="text-center">Dictamen</TableHead>
                      <TableHead className="text-center">Ptje. Auto</TableHead>
                      <TableHead className="text-center">Ptje. Eval</TableHead>
                      <TableHead className="text-center">Ptje. Dict</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium">{r.criterio.idCriterio}</div>
                          <span className="text-xs text-muted-foreground">{r.criterio.nombre}</span>
                        </TableCell>
                        <TableCell className="text-center">{r.nivelAutoevaluacion ?? "-"}</TableCell>
                        <TableCell className="text-center">{r.nivelEvaluador ?? "-"}</TableCell>
                        <TableCell className="text-center">{r.nivelDictamen ?? "-"}</TableCell>
                        <TableCell className="text-center">{r.puntajeAutoevaluacion?.toFixed(2) ?? "-"}</TableCell>
                        <TableCell className="text-center">{r.puntajeEvaluador?.toFixed(2) ?? "-"}</TableCell>
                        <TableCell className="text-center">{r.puntajeDictamen?.toFixed(2) ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
