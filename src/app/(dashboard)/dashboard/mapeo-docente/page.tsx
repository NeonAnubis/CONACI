"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { UserCheck } from "lucide-react";
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

type MapeoDocenteRecord = {
  id: string;
  idDocente: string;
  nombre: string;
  tipoContratacion: string | null;
  gradoAcademico: string | null;
  areaEspecializacion: string | null;
  antiguedadInstitucion: number | null;
  antiguedadPrograma: number | null;
  cumplePerfil: boolean | null;
  nivelIdoneidad: number | null;
  procesoId: string;
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
  };
};

const contratacionColors: Record<string, string> = {
  TIEMPO_COMPLETO: "bg-sky-100 text-sky-800",
  TRES_CUARTOS: "bg-blue-100 text-blue-800",
  MEDIO_TIEMPO: "bg-indigo-100 text-indigo-800",
  ASIGNATURA: "bg-violet-100 text-violet-800",
  INVESTIGADOR: "bg-emerald-100 text-emerald-800",
  EXTERNO: "bg-amber-100 text-amber-800",
};

const gradoColors: Record<string, string> = {
  TSU: "bg-gray-100 text-gray-800",
  PA: "bg-gray-100 text-gray-800",
  LICENCIATURA: "bg-sky-50 text-sky-700",
  ESPECIALIDAD: "bg-blue-50 text-blue-700",
  MAESTRIA: "bg-indigo-50 text-indigo-700",
  DOCTORADO: "bg-violet-50 text-violet-700",
};

const contratacionKeys: Record<string, string> = {
  TIEMPO_COMPLETO: "tiempoCompleto",
  TRES_CUARTOS: "tresCuartos",
  MEDIO_TIEMPO: "medioTiempo",
  ASIGNATURA: "asignatura",
  INVESTIGADOR: "investigador",
  EXTERNO: "externo",
};

const gradoKeys: Record<string, string> = {
  TSU: "tsu",
  PA: "pa",
  LICENCIATURA: "licenciatura",
  ESPECIALIDAD: "especialidad",
  MAESTRIA: "maestria",
  DOCTORADO: "doctorado",
};

async function fetchMapeoDocente(): Promise<MapeoDocenteRecord[]> {
  const res = await fetch("/api/mapeo-docente");
  if (!res.ok) throw new Error("Error fetching mapeo docente");
  return res.json();
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function MapeoDocentePage() {
  const t = useTranslations("academic");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const { data: docentes, isLoading, isError } = useQuery({
    queryKey: ["mapeo-docente"],
    queryFn: fetchMapeoDocente,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {tNav("mapeoDocente")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("mapeoDocente")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("mapeoDocente")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <p className="text-destructive">{tCommon("error")}</p>
          ) : !docentes || docentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UserCheck className="size-12 mb-3 opacity-30" />
              <p>{t("noData")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("nombre")}</TableHead>
                    <TableHead>{t("tipoContratacion")}</TableHead>
                    <TableHead>{t("gradoAcademico")}</TableHead>
                    <TableHead>{t("areaEspecializacion")}</TableHead>
                    <TableHead className="text-right">{t("antiguedadInstitucion")}</TableHead>
                    <TableHead className="text-right">{t("antiguedadPrograma")}</TableHead>
                    <TableHead className="text-center">{t("cumplePerfil")}</TableHead>
                    <TableHead className="text-right">{t("nivelIdoneidad")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docentes.map((docente) => (
                    <TableRow key={docente.id}>
                      <TableCell className="font-medium">{docente.nombre}</TableCell>
                      <TableCell>
                        {docente.tipoContratacion ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              contratacionColors[docente.tipoContratacion] ?? "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {t(contratacionKeys[docente.tipoContratacion] ?? docente.tipoContratacion)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {docente.gradoAcademico ? (
                          <Badge variant="secondary" className={gradoColors[docente.gradoAcademico] ?? ""}>
                            {t(gradoKeys[docente.gradoAcademico] ?? docente.gradoAcademico)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {docente.areaEspecializacion ?? <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {docente.antiguedadInstitucion != null
                          ? `${docente.antiguedadInstitucion}`
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {docente.antiguedadPrograma != null
                          ? `${docente.antiguedadPrograma}`
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {docente.cumplePerfil != null ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              docente.cumplePerfil
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {docente.cumplePerfil ? t("si") : t("no")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {docente.nivelIdoneidad != null
                          ? docente.nivelIdoneidad.toFixed(1)
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
