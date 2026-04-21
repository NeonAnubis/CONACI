"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type Asignacion = {
  id: string;
  idAsignacion: string;
  claveEvaluador: string | null;
  user: { id: string; name: string; email: string };
  categoria: { id: string; idCategoria: string; nombre: string; numero?: number };
  proceso: {
    id: string;
    idProceso: string;
    nombreProceso: string;
    estadoProceso?: string;
    institucion?: { id: string; nombre: string } | null;
  };
};

type Proceso = {
  id: string;
  idProceso: string;
  nombreProceso: string;
};

type Categoria = {
  id: string;
  idCategoria: string;
  nombre: string;
  numero: number;
  instrumentoId: string;
};

type Usuario = {
  id: string;
  name: string;
  email: string;
  rolSistema: string;
};

type FormData = {
  idAsignacion: string;
  procesoId: string;
  categoriaId: string;
  userId: string;
  claveEvaluador: string;
};

const emptyForm: FormData = {
  idAsignacion: "",
  procesoId: "",
  categoriaId: "",
  userId: "",
  claveEvaluador: "",
};

export default function EvaluadoresAdminPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormData>(emptyForm);

  const { data: asignaciones, isLoading } = useQuery<Asignacion[]>({
    queryKey: ["asignaciones"],
    queryFn: async () => {
      const res = await fetch("/api/asignaciones");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: procesos } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await fetch("/api/categorias");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: usuarios } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const evaluadores = usuarios?.filter((u) => u.rolSistema === "EVALUADOR") ?? [];

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/asignaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idAsignacion: data.idAsignacion,
          procesoId: data.procesoId,
          categoriaId: data.categoriaId,
          userId: data.userId,
          claveEvaluador: data.claveEvaluador || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
      toast.success(t("saved"));
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message || t("errorSaving")),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate(form);
  }

  const columns: Column<Asignacion>[] = [
    { key: "idAsignacion", header: t("assignmentId") },
    {
      key: "evaluator",
      header: t("evaluator"),
      render: (row) => (
        <div>
          <p className="font-medium">{row.user.name}</p>
          <p className="text-xs text-muted-foreground">{row.user.email}</p>
        </div>
      ),
      searchable: false,
    },
    {
      key: "category",
      header: t("category"),
      render: (row) => (
        <span>
          {row.categoria.idCategoria} - {row.categoria.nombre}
        </span>
      ),
      searchable: false,
    },
    {
      key: "process",
      header: t("process"),
      render: (row) => (
        <span>
          {row.proceso.idProceso} - {row.proceso.nombreProceso}
        </span>
      ),
      searchable: false,
    },
    {
      key: "claveEvaluador",
      header: t("key"),
      render: (row) => row.claveEvaluador ?? "-",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{tNav("gestionEvaluadores")}</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setForm(emptyForm);
          }}
        >
          <DialogTrigger
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("addAssignment")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addAssignment")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>{t("assignmentId")}</Label>
                <Input
                  value={form.idAsignacion}
                  onChange={(e) => setForm({ ...form, idAsignacion: e.target.value })}
                  placeholder="ASG003"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>{t("evaluator")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                >
                  <option value="">{tCommon("search")}...</option>
                  {evaluadores.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>{t("process")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.procesoId}
                  onChange={(e) => setForm({ ...form, procesoId: e.target.value })}
                  required
                >
                  <option value="">{tCommon("search")}...</option>
                  {procesos?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.idProceso} - {p.nombreProceso}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>{t("category")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.categoriaId}
                  onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                  required
                >
                  <option value="">{tCommon("search")}...</option>
                  {categorias?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.idCategoria} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>{t("key")}</Label>
                <Input
                  value={form.claveEvaluador}
                  onChange={(e) => setForm({ ...form, claveEvaluador: e.target.value })}
                  placeholder="EV-003"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {createMutation.isPending ? tCommon("loading") : tCommon("save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("evaluatorAssignments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={asignaciones ?? []}
            columns={columns}
            emptyMessage={t("noAssignments")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
