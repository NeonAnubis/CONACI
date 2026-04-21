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
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Globe, User, Phone, Mail } from "lucide-react";

type Proceso = {
  id: string;
  institucion: {
    id: string;
    nombre: string;
    campus: string | null;
  } | null;
};

type Institucion = {
  id: string;
  idInstitucion: string;
  nombre: string;
  campus: string | null;
  direccion: string | null;
  ciudad: string | null;
  pais: string | null;
  contactoPrincipal: string | null;
  telefono: string | null;
  correo: string | null;
};

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MiInstitucionPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");

  // Get user's process to find their institution
  const { data: procesos } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const institucionId = procesos?.[0]?.institucion?.id;

  const { data: instituciones, isLoading, error } = useQuery<Institucion[]>({
    queryKey: ["instituciones"],
    queryFn: async () => {
      const res = await fetch("/api/instituciones");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const institucion = instituciones?.find((i) => i.id === institucionId) ?? instituciones?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("miInstitucion")}</h1>
        <p className="mt-1 text-muted-foreground">{t("institution")}</p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && !institucion && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {tCommon("noResults")}
          </CardContent>
        </Card>
      )}

      {institucion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-sky-500" />
              {institucion.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Campus</dt>
                  <dd className="mt-0.5">{institucion.campus ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Ciudad</dt>
                  <dd className="mt-0.5">{institucion.ciudad ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Pais</dt>
                  <dd className="mt-0.5">{institucion.pais ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Contacto</dt>
                  <dd className="mt-0.5">{institucion.contactoPrincipal ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Telefono</dt>
                  <dd className="mt-0.5">{institucion.telefono ?? "-"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground uppercase">Correo</dt>
                  <dd className="mt-0.5">{institucion.correo ?? "-"}</dd>
                </div>
              </div>

              {institucion.direccion && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground uppercase">Direccion</dt>
                    <dd className="mt-0.5">{institucion.direccion}</dd>
                  </div>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
