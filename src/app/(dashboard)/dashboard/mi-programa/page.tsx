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
import { GraduationCap, User, Mail, Building2 } from "lucide-react";

type Programa = {
  id: string;
  idPrograma: string;
  nombre: string;
  tipoPrograma: string | null;
  coordinador: string | null;
  correoCoordinador: string | null;
  institucion: {
    id: string;
    nombre: string;
  };
};

const tipoProgramaMap: Record<string, string> = {
  LICENCIATURA: "licenciatura",
  MAESTRIA: "maestria",
  DOCTORADO: "doctorado",
  ESPECIALIDAD: "especialidad",
};

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MiProgramaPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");
  const tAcademic = useTranslations("academic");

  const { data: programas, isLoading, error } = useQuery<Programa[]>({
    queryKey: ["programas"],
    queryFn: async () => {
      const res = await fetch("/api/programas");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const programa = programas?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("miPrograma")}</h1>
        <p className="mt-1 text-muted-foreground">{t("program")}</p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && !programa && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("noResults")}
          </CardContent>
        </Card>
      )}

      {programa && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-sky-500" />
              {programa.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">ID</dt>
                  <dd className="mt-0.5 font-medium">{programa.idPrograma}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-4" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Tipo</dt>
                  <dd className="mt-1">
                    {programa.tipoPrograma ? (
                      <Badge variant="secondary">
                        {tAcademic(tipoProgramaMap[programa.tipoPrograma] ?? "licenciatura")}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Coordinador</dt>
                  <dd className="mt-0.5">{programa.coordinador ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Correo Coordinador</dt>
                  <dd className="mt-0.5">{programa.correoCoordinador ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <Building2 className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">
                    {t("institution")}
                  </dt>
                  <dd className="mt-0.5">{programa.institucion.nombre}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
