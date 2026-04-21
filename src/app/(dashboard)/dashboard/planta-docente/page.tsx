"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
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

type PlantaDocenteRecord = {
  id: string;
  idRegistro: string;
  tipoContratacion: string;
  gradoEstudio: string;
  numeroDocentes: number;
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

async function fetchPlantaDocente(): Promise<PlantaDocenteRecord[]> {
  const res = await fetch("/api/planta-docente");
  if (!res.ok) throw new Error("Error fetching planta docente");
  return res.json();
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function PlantaDocentePage() {
  const t = useTranslations("academic");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const { data: registros, isLoading, isError } = useQuery({
    queryKey: ["planta-docente"],
    queryFn: fetchPlantaDocente,
  });

  const totalDocentes = registros?.reduce((sum, r) => sum + r.numeroDocentes, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tNav("plantaDocente")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("plantaDocente")}
          </p>
        </div>
        {!isLoading && registros && registros.length > 0 && (
          <Card size="sm" className="min-w-[140px]">
            <CardContent className="flex items-center gap-3 py-0">
              <Users className="size-5 text-sky-500" />
              <div>
                <p className="text-xs text-muted-foreground">{t("totalDocentes")}</p>
                <p className="text-lg font-bold">{totalDocentes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("plantaDocente")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <p className="text-destructive">{tCommon("error")}</p>
          ) : !registros || registros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="size-12 mb-3 opacity-30" />
              <p>{t("noData")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tipoContratacion")}</TableHead>
                  <TableHead>{t("gradoEstudio")}</TableHead>
                  <TableHead className="text-right">{t("numeroDocentes")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          contratacionColors[registro.tipoContratacion] ?? "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t(contratacionKeys[registro.tipoContratacion] ?? registro.tipoContratacion)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={gradoColors[registro.gradoEstudio] ?? ""}>
                        {t(gradoKeys[registro.gradoEstudio] ?? registro.gradoEstudio)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {registro.numeroDocentes}
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
