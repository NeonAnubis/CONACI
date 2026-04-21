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

type Asignacion = {
  id: string;
  idAsignacion: string;
  categoria: {
    id: string;
    idCategoria: string;
    nombre: string;
    numero: number;
  };
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
    estadoProceso: string;
    institucion: { id: string; nombre: string } | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const estadoMap: Record<string, string> = {
  EN_PREPARACION: "enPreparacion",
  EN_AUTOEVALUACION: "enAutoevaluacion",
  EN_EVALUACION: "enEvaluacion",
  EN_DICTAMEN: "enDictamen",
  COMPLETADO: "completado",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function MisCriteriosPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");
  const tProcess = useTranslations("process");

  const { data: asignaciones, isLoading, error } = useQuery<Asignacion[]>({
    queryKey: ["asignaciones"],
    queryFn: async () => {
      const res = await fetch("/api/asignaciones");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("misCriterios")}</h1>
        <p className="mt-1 text-muted-foreground">{t("criteria")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tNav("misCriterios")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton />}

          {error && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("error")}</p>
          )}

          {!isLoading && !error && asignaciones && asignaciones.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("noResults")}</p>
          )}

          {asignaciones && asignaciones.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("process")}</TableHead>
                  <TableHead>{t("institution")}</TableHead>
                  <TableHead>{tCommon("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asignaciones.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.categoria.nombre}</div>
                      <span className="text-xs text-muted-foreground">
                        {a.categoria.idCategoria}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>{a.proceso.nombreProceso}</div>
                      <span className="text-xs text-muted-foreground">
                        {a.proceso.idProceso}
                      </span>
                    </TableCell>
                    <TableCell>
                      {a.proceso.institucion?.nombre ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {tProcess(estadoMap[a.proceso.estadoProceso] ?? "enPreparacion")}
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
