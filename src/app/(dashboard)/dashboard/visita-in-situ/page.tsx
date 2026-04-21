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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";

type Evaluacion = {
  id: string;
  idEvaluacion: string;
  etapa: string;
  rol: string;
  nivel: number | null;
  justificacion: string | null;
  observaciones: string | null;
  recomendaciones: string | null;
  fechaRegistro: string;
  criterio: {
    id: string;
    idCriterio: string;
    nombre: string;
    numero: number;
    categoria: {
      id: string;
      nombre: string;
    };
  };
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
  };
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

export default function VisitaInSituPage() {
  const { user } = useCurrentUser();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const t = useTranslations("dashboard");
  const queryClient = useQueryClient();

  const [editingItem, setEditingItem] = useState<Evaluacion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nivel: "",
    justificacion: "",
    observaciones: "",
    recomendaciones: "",
  });

  const { data: evaluaciones, isLoading, error } = useQuery<Evaluacion[]>({
    queryKey: ["evaluaciones-visita"],
    queryFn: async () => {
      const res = await fetch("/api/evaluaciones?etapa=VISITA_IN_SITU");
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      id: string;
      nivel?: number;
      justificacion?: string;
      observaciones?: string;
      recomendaciones?: string;
    }) => {
      const res = await fetch("/api/evaluaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error updating");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluaciones-visita"] });
      toast.success(tCommon("success"));
      setDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.error(tCommon("error"));
    },
  });

  function handleEdit(item: Evaluacion) {
    setEditingItem(item);
    setFormData({
      nivel: item.nivel?.toString() ?? "",
      justificacion: item.justificacion ?? "",
      observaciones: item.observaciones ?? "",
      recomendaciones: item.recomendaciones ?? "",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!editingItem) return;
    const nivel = formData.nivel ? parseFloat(formData.nivel) : undefined;
    if (nivel !== undefined && (isNaN(nivel) || nivel < 0 || nivel > 5)) {
      toast.error("Nivel debe ser entre 0 y 5");
      return;
    }
    mutation.mutate({
      id: editingItem.id,
      nivel,
      justificacion: formData.justificacion || undefined,
      observaciones: formData.observaciones || undefined,
      recomendaciones: formData.recomendaciones || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("visitaInSitu")}</h1>
        <p className="mt-1 text-muted-foreground">{t("stage")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tNav("visitaInSitu")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton />}

          {error && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("error")}</p>
          )}

          {!isLoading && !error && evaluaciones && evaluaciones.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("noResults")}</p>
          )}

          {evaluaciones && evaluaciones.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("criteria")}</TableHead>
                  <TableHead>{t("level")}</TableHead>
                  <TableHead>{t("justification")}</TableHead>
                  <TableHead>{t("observations")}</TableHead>
                  <TableHead className="text-right">{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluaciones.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="font-medium">{e.criterio.idCriterio}</div>
                      <span className="text-xs text-muted-foreground">{e.criterio.nombre}</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {e.nivel ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate text-sm text-muted-foreground">
                        {e.justificacion ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate text-sm text-muted-foreground">
                        {e.observaciones ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(e)}>
                        <Pencil className="size-4" />
                      </Button>
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
            <DialogTitle>
              {tCommon("edit")} - {editingItem?.criterio.nombre}
            </DialogTitle>
            <DialogDescription>
              {editingItem?.criterio.idCriterio}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t("level")} (0-5)</Label>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={formData.nivel}
                onChange={(e) => setFormData((prev) => ({ ...prev, nivel: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("justification")}</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                value={formData.justificacion}
                onChange={(e) => setFormData((prev) => ({ ...prev, justificacion: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("observations")}</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                value={formData.observaciones}
                onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("recommendations")}</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                value={formData.recomendaciones}
                onChange={(e) => setFormData((prev) => ({ ...prev, recomendaciones: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
