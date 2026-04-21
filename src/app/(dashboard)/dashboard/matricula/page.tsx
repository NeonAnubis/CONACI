"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type MatriculaRecord = {
  id: string;
  idMatricula: string;
  generacion: number;
  tipoIngreso: string;
  genero: string;
  numero: number;
  procesoId: string;
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
  };
};

const tipoIngresoColors: Record<string, string> = {
  NUEVO_INGRESO: "bg-sky-100 text-sky-800",
  REINGRESO: "bg-amber-100 text-amber-800",
};

const generoColors: Record<string, string> = {
  HOMBRES: "bg-blue-100 text-blue-800",
  MUJERES: "bg-pink-100 text-pink-800",
};

const tipoIngresoKeys: Record<string, string> = {
  NUEVO_INGRESO: "nuevoIngreso",
  REINGRESO: "reingreso",
};

const generoKeys: Record<string, string> = {
  HOMBRES: "hombres",
  MUJERES: "mujeres",
};

async function fetchMatricula(): Promise<MatriculaRecord[]> {
  const res = await fetch("/api/matricula");
  if (!res.ok) throw new Error("Error fetching matricula");
  return res.json();
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function MatriculaPage() {
  const t = useTranslations("academic");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const { data: matriculas, isLoading, isError } = useQuery({
    queryKey: ["matricula"],
    queryFn: fetchMatricula,
  });

  const totalMatricula = matriculas?.reduce((sum, m) => sum + m.numero, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tNav("matricula")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("matricula")}
          </p>
        </div>
        {!isLoading && matriculas && matriculas.length > 0 && (
          <Card size="sm" className="min-w-[140px]">
            <CardContent className="flex items-center gap-3 py-0">
              <GraduationCap className="size-5 text-sky-500" />
              <div>
                <p className="text-xs text-muted-foreground">{t("totalMatricula")}</p>
                <p className="text-lg font-bold">{totalMatricula}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("matricula")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <p className="text-destructive">{tCommon("error")}</p>
          ) : !matriculas || matriculas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <GraduationCap className="size-12 mb-3 opacity-30" />
              <p>{t("noData")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("generacion")}</TableHead>
                  <TableHead>{t("tipoIngreso")}</TableHead>
                  <TableHead>{t("genero")}</TableHead>
                  <TableHead className="text-right">{t("numero")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculas.map((matricula) => (
                  <TableRow key={matricula.id}>
                    <TableCell className="font-medium">{matricula.generacion}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          tipoIngresoColors[matricula.tipoIngreso] ?? "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t(tipoIngresoKeys[matricula.tipoIngreso] ?? matricula.tipoIngreso)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={generoColors[matricula.genero] ?? ""}
                      >
                        {t(generoKeys[matricula.genero] ?? matricula.genero)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {matricula.numero}
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
