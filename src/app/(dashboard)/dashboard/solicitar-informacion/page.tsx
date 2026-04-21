"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

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

type Asignacion = {
  id: string;
  proceso: { id: string };
  categoria: {
    id: string;
    nombre: string;
  };
};

type Criterio = {
  id: string;
  idCriterio: string;
  nombre: string;
  numero: number;
  categoriaId: string;
  categoria: {
    id: string;
    nombre: string;
  };
};

type ResultadoCriterio = {
  id: string;
  criterio: {
    id: string;
    idCriterio: string;
    nombre: string;
    categoria: {
      id: string;
    };
  };
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

export default function SolicitarInformacionPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [criterioId, setCriterioId] = useState("");

  const { data: asignaciones } = useQuery<Asignacion[]>({
    queryKey: ["asignaciones"],
    queryFn: async () => {
      const res = await fetch("/api/asignaciones");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const procesoId = asignaciones?.[0]?.proceso?.id;

  const { data: solicitudes, isLoading, error } = useQuery<Solicitud[]>({
    queryKey: ["solicitudes-evaluador"],
    queryFn: async () => {
      const res = await fetch("/api/solicitudes");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  // Get criterios from resultado-criterio for the assigned process
  const { data: resultados } = useQuery<ResultadoCriterio[]>({
    queryKey: ["resultado-criterio", procesoId],
    queryFn: async () => {
      const res = await fetch(`/api/resultado-criterio?procesoId=${procesoId}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!procesoId,
  });

  // Filter criterios to only those in assigned categories
  const assignedCategoryIds = asignaciones?.map((a) => a.categoria.id) ?? [];
  const availableCriterios = resultados?.filter((r) =>
    assignedCategoryIds.includes(r.criterio.categoria.id)
  ) ?? [];

  const createMutation = useMutation({
    mutationFn: async (data: { descripcion: string; tipo: string; procesoId: string; criterioId: string }) => {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error creating");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitudes-evaluador"] });
      toast.success(tCommon("success"));
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error(tCommon("error"));
    },
  });

  function resetForm() {
    setDescripcion("");
    setTipo("");
    setCriterioId("");
  }

  function handleCreate() {
    if (!descripcion.trim() || !criterioId || !procesoId) {
      toast.error(tCommon("required"));
      return;
    }
    createMutation.mutate({
      descripcion,
      tipo,
      procesoId,
      criterioId,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tNav("solicitarInformacion")}</h1>
          <p className="mt-1 text-muted-foreground">{t("pendingTasks")}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1 size-4" />
          {tCommon("add")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tNav("solicitarInformacion")}</CardTitle>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>{tCommon("date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="max-w-xs truncate">{s.descripcion}</div>
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
                    <TableCell>{s.tipo ?? "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.fechaSolicitud).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCommon("create")} Solicitud</DialogTitle>
            <DialogDescription>
              {tNav("solicitarInformacion")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{tCommon("description")}</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder={tCommon("description")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("criteria")}</Label>
              <Select value={criterioId} onChange={(e) => setCriterioId(e.target.value)}>
                <option value="">{t("criteria")}</option>
                {availableCriterios.map((r) => (
                  <option key={r.criterio.id} value={r.criterio.id}>
                    {r.criterio.idCriterio} - {r.criterio.nombre}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Input
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Tipo de solicitud"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {tCommon("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
