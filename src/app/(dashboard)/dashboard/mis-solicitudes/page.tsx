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

type Solicitud = {
  id: string;
  idSolicitud: string;
  descripcion: string;
  tipo: string | null;
  estado: string;
  fechaSolicitud: string;
  criterio: {
    id: string;
    idCriterio: string;
    nombre: string;
  };
  evaluador: {
    id: string;
    name: string;
  };
  respuestas: {
    id: string;
    respuesta: string;
    fechaRegistro: string;
  }[];
};

type Proceso = {
  id: string;
};

const estadoBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  PENDIENTE: "outline",
  RESPONDIDA: "secondary",
  CERRADA: "default",
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

export default function MisSolicitudesPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");

  const { data: procesos } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const procesoId = procesos?.[0]?.id;

  const { data: solicitudes, isLoading, error } = useQuery<Solicitud[]>({
    queryKey: ["solicitudes", procesoId],
    queryFn: async () => {
      const res = await fetch(`/api/solicitudes?procesoId=${procesoId}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!procesoId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("misSolicitudes")}</h1>
        <p className="mt-1 text-muted-foreground">{t("pendingTasks")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tNav("misSolicitudes")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton />}

          {error && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("error")}</p>
          )}

          {!isLoading && !error && solicitudes && solicitudes.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("noResults")}</p>
          )}

          {solicitudes && solicitudes.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("description")}</TableHead>
                  <TableHead>{t("criteria")}</TableHead>
                  <TableHead>{tCommon("status")}</TableHead>
                  <TableHead>Respuesta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="max-w-xs truncate">{s.descripcion}</div>
                      {s.tipo && (
                        <span className="text-xs text-muted-foreground">{s.tipo}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{s.criterio.idCriterio}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{s.criterio.nombre}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={estadoBadgeVariant[s.estado] ?? "outline"}>
                        {s.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.respuestas.length > 0 ? (
                        <div className="max-w-xs truncate text-sm">
                          {s.respuestas[0].respuesta}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
