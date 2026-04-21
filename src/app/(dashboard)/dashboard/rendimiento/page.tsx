"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RendimientoRecord = {
  id: string;
  idRendimiento: string;
  idCohorte: string;
  ingresaron: number;
  desercion: number;
  egresados: number;
  titulados: number;
  procesoId: string;
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
  };
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums w-14 text-right">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

async function fetchRendimiento(): Promise<RendimientoRecord[]> {
  const res = await fetch("/api/rendimiento");
  if (!res.ok) throw new Error("Error fetching rendimiento");
  return res.json();
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

function IndicatorSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function RendimientoPage() {
  const t = useTranslations("academic");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const { data: rendimientos, isLoading, isError } = useQuery({
    queryKey: ["rendimiento"],
    queryFn: fetchRendimiento,
  });

  function calcRate(value: number, ingresaron: number): number {
    if (ingresaron === 0) return 0;
    return (value / ingresaron) * 100;
  }

  const aggregated = rendimientos
    ? {
        totalIngresaron: rendimientos.reduce((s, r) => s + r.ingresaron, 0),
        totalDesercion: rendimientos.reduce((s, r) => s + r.desercion, 0),
        totalEgresados: rendimientos.reduce((s, r) => s + r.egresados, 0),
        totalTitulados: rendimientos.reduce((s, r) => s + r.titulados, 0),
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {tNav("rendimiento")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("rendimiento")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main data table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("rendimiento")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <p className="text-destructive">{tCommon("error")}</p>
            ) : !rendimientos || rendimientos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BarChart3 className="size-12 mb-3 opacity-30" />
                <p>{t("noData")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("cohorte")}</TableHead>
                    <TableHead className="text-right">{t("ingresaron")}</TableHead>
                    <TableHead className="text-right">{t("desercion")}</TableHead>
                    <TableHead className="text-right">{t("egresados")}</TableHead>
                    <TableHead className="text-right">{t("titulados")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rendimientos.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.idCohorte}</TableCell>
                      <TableCell className="text-right">{r.ingresaron}</TableCell>
                      <TableCell className="text-right">{r.desercion}</TableCell>
                      <TableCell className="text-right">{r.egresados}</TableCell>
                      <TableCell className="text-right">{r.titulados}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Indicators sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>{t("indicadores")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <IndicatorSkeleton />
            ) : !aggregated || !rendimientos || rendimientos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BarChart3 className="size-8 mb-2 opacity-30" />
                <p className="text-sm">{t("noData")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tasa Desercion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t("tasaDesercion")}</p>
                  </div>
                  <ProgressBar
                    value={calcRate(aggregated.totalDesercion, aggregated.totalIngresaron)}
                    color="bg-red-500"
                  />
                </div>

                {/* Eficiencia Terminal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t("eficienciaTerminal")}</p>
                  </div>
                  <ProgressBar
                    value={calcRate(aggregated.totalEgresados, aggregated.totalIngresaron)}
                    color="bg-sky-500"
                  />
                </div>

                {/* Tasa Titulacion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t("tasaTitulacion")}</p>
                  </div>
                  <ProgressBar
                    value={calcRate(aggregated.totalTitulados, aggregated.totalIngresaron)}
                    color="bg-emerald-500"
                  />
                </div>

                {/* Per-cohort breakdown */}
                <div className="pt-4 border-t space-y-4">
                  {rendimientos.map((r) => {
                    const tasaDesercion = calcRate(r.desercion, r.ingresaron);
                    const eficiencia = calcRate(r.egresados, r.ingresaron);
                    const titulacion = calcRate(r.titulados, r.ingresaron);

                    return (
                      <div key={r.id} className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {r.idCohorte}
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-8">Des</span>
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-red-400"
                                style={{ width: `${Math.min(100, tasaDesercion)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-12 text-right">{tasaDesercion.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-8">Efi</span>
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-sky-400"
                                style={{ width: `${Math.min(100, eficiencia)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-12 text-right">{eficiencia.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-8">Tit</span>
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-400"
                                style={{ width: `${Math.min(100, titulacion)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-12 text-right">{titulacion.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
