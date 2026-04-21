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

type ResultadoCriterio = {
  id: string;
  idResultado: string;
  nivelAutoevaluacion: number | null;
  nivelEvaluador: number | null;
  nivelDictamen: number | null;
  factor: number;
  criterio: {
    id: string;
    idCriterio: string;
    numero: number;
    nombre: string;
    valorMaximo: number;
    categoria: {
      id: string;
      idCategoria: string;
      nombre: string;
      numero: number;
    };
  };
};

type Asignacion = {
  id: string;
  proceso: { id: string };
};

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function EvaluarCriterioPage() {
  const { user } = useCurrentUser();
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();

  const [editingItem, setEditingItem] = useState<ResultadoCriterio | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: resultados, isLoading, error } = useQuery<ResultadoCriterio[]>({
    queryKey: ["resultado-criterio", procesoId],
    queryFn: async () => {
      const res = await fetch(`/api/resultado-criterio?procesoId=${procesoId}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    enabled: !!procesoId,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, nivelEvaluador }: { id: string; nivelEvaluador: number }) => {
      const res = await fetch("/api/resultado-criterio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nivelEvaluador }),
      });
      if (!res.ok) throw new Error("Error updating");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resultado-criterio", procesoId] });
      toast.success(tCommon("success"));
      setDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.error(tCommon("error"));
    },
  });

  function handleEdit(item: ResultadoCriterio) {
    setEditingItem(item);
    setEditValue(item.nivelEvaluador?.toString() ?? "");
    setDialogOpen(true);
  }

  function handleSave() {
    if (!editingItem) return;
    const value = parseFloat(editValue);
    if (isNaN(value) || value < 0 || value > 5) {
      toast.error("Nivel debe ser entre 0 y 5");
      return;
    }
    mutation.mutate({ id: editingItem.id, nivelEvaluador: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tNav("evaluarCriterio")}</h1>
        <p className="mt-1 text-muted-foreground">{t("score")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tNav("evaluarCriterio")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton />}

          {error && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("error")}</p>
          )}

          {!isLoading && !error && resultados && resultados.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">{tCommon("noResults")}</p>
          )}

          {resultados && resultados.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("criteria")}</TableHead>
                  <TableHead className="text-center">Nivel Auto</TableHead>
                  <TableHead className="text-center">Nivel Evaluador</TableHead>
                  <TableHead className="text-right">{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{r.criterio.idCriterio}</span>
                        <span className="ml-2 text-muted-foreground">{r.criterio.nombre}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {r.criterio.categoria.nombre}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {r.nivelAutoevaluacion ?? "-"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {r.nivelEvaluador ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(r)}>
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
              <Label>Nivel Evaluador (0-5)</Label>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
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
