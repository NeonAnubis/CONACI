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
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Instrumento = {
  id: string;
  idInstrumento: string;
  nombre: string;
  tipo: string;
};

type Institucion = {
  id: string;
  nombre: string;
  programas?: { id: string; nombre: string }[];
};

type Proceso = {
  id: string;
  idProceso: string;
  nombreProceso: string;
  estadoProceso: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  instrumentoId: string;
  institucionId: string | null;
  programaId: string | null;
  instrumento: { id: string; nombre: string; tipo: string } | null;
  institucion: { id: string; nombre: string; campus?: string } | null;
  programaAcademico: { id: string; nombre: string } | null;
};

const estadoColors: Record<string, string> = {
  EN_PREPARACION: "bg-gray-100 text-gray-700",
  EN_AUTOEVALUACION: "bg-sky-100 text-sky-700",
  EN_EVALUACION: "bg-amber-100 text-amber-700",
  EN_DICTAMEN: "bg-violet-100 text-violet-700",
  COMPLETADO: "bg-emerald-100 text-emerald-700",
};

const estadoKeyMap: Record<string, string> = {
  EN_PREPARACION: "enPreparacion",
  EN_AUTOEVALUACION: "enAutoevaluacion",
  EN_EVALUACION: "enEvaluacion",
  EN_DICTAMEN: "enDictamen",
  COMPLETADO: "completado",
};

const estadoOptions = [
  "EN_PREPARACION",
  "EN_AUTOEVALUACION",
  "EN_EVALUACION",
  "EN_DICTAMEN",
  "COMPLETADO",
];

type FormData = {
  idProceso: string;
  nombreProceso: string;
  estadoProceso: string;
  fechaInicio: string;
  fechaFin: string;
  instrumentoId: string;
  institucionId: string;
  programaId: string;
};

const emptyForm: FormData = {
  idProceso: "",
  nombreProceso: "",
  estadoProceso: "EN_PREPARACION",
  fechaInicio: "",
  fechaFin: "",
  instrumentoId: "",
  institucionId: "",
  programaId: "",
};

export default function ProcesosAdminPage() {
  const t = useTranslations("admin");
  const tProcess = useTranslations("process");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormData>(emptyForm);

  const { data: procesos, isLoading } = useQuery<Proceso[]>({
    queryKey: ["procesos"],
    queryFn: async () => {
      const res = await fetch("/api/procesos");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: instrumentos } = useQuery<Instrumento[]>({
    queryKey: ["instrumentos"],
    queryFn: async () => {
      const res = await fetch("/api/instrumentos");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: instituciones } = useQuery<Institucion[]>({
    queryKey: ["instituciones"],
    queryFn: async () => {
      const res = await fetch("/api/instituciones");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/procesos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fechaInicio: data.fechaInicio || null,
          fechaFin: data.fechaFin || null,
          institucionId: data.institucionId || null,
          programaId: data.programaId || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procesos"] });
      toast.success(t("saved"));
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error(t("errorSaving")),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData> }) => {
      const res = await fetch(`/api/procesos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fechaInicio: data.fechaInicio || null,
          fechaFin: data.fechaFin || null,
          institucionId: data.institucionId || null,
          programaId: data.programaId || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procesos"] });
      toast.success(t("saved"));
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error(t("errorSaving")),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/procesos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procesos"] });
      toast.success(t("deleted"));
    },
    onError: () => toast.error(t("errorDeleting")),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function openEdit(p: Proceso) {
    setEditingId(p.id);
    setForm({
      idProceso: p.idProceso,
      nombreProceso: p.nombreProceso,
      estadoProceso: p.estadoProceso,
      fechaInicio: p.fechaInicio ? p.fechaInicio.slice(0, 10) : "",
      fechaFin: p.fechaFin ? p.fechaFin.slice(0, 10) : "",
      instrumentoId: p.instrumento?.id ?? "",
      institucionId: p.institucion?.id ?? "",
      programaId: p.programaAcademico?.id ?? "",
    });
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  function handleDelete(id: string) {
    if (window.confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  }

  const columns: Column<Proceso>[] = [
    { key: "idProceso", header: t("processId") },
    { key: "nombreProceso", header: t("processName") },
    {
      key: "estadoProceso",
      header: t("status"),
      render: (row) => (
        <Badge className={estadoColors[row.estadoProceso] ?? ""}>
          {tProcess(estadoKeyMap[row.estadoProceso] ?? "enPreparacion")}
        </Badge>
      ),
    },
    {
      key: "instrumento",
      header: t("instrument"),
      render: (row) => row.instrumento?.nombre ?? "-",
      searchable: false,
    },
    {
      key: "institucion",
      header: t("institution"),
      render: (row) => row.institucion?.nombre ?? "-",
      searchable: false,
    },
    {
      key: "fechaInicio",
      header: t("startDate"),
      render: (row) =>
        row.fechaInicio ? new Date(row.fechaInicio).toLocaleDateString() : "-",
    },
    {
      key: "actions",
      header: tCommon("actions"),
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={() => openEdit(row)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      ),
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
        <h1 className="text-2xl font-bold tracking-tight">{tNav("gestionProcesos")}</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("addProcess")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? t("editProcess") : t("addProcess")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div className="space-y-1">
                  <Label>{t("processId")}</Label>
                  <Input
                    value={form.idProceso}
                    onChange={(e) => setForm({ ...form, idProceso: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label>{t("processName")}</Label>
                <Input
                  value={form.nombreProceso}
                  onChange={(e) => setForm({ ...form, nombreProceso: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>{t("status")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.estadoProceso}
                  onChange={(e) => setForm({ ...form, estadoProceso: e.target.value })}
                >
                  {estadoOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {tProcess(estadoKeyMap[opt])}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>{t("startDate")}</Label>
                  <Input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("endDate")}</Label>
                  <Input
                    type="date"
                    value={form.fechaFin}
                    onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>{t("instrument")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.instrumentoId}
                  onChange={(e) => setForm({ ...form, instrumentoId: e.target.value })}
                  required
                >
                  <option value="">{tCommon("search")}...</option>
                  {instrumentos?.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nombre} ({inst.tipo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>{t("institution")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.institucionId}
                  onChange={(e) => setForm({ ...form, institucionId: e.target.value })}
                >
                  <option value="">{tCommon("optional")}</option>
                  {instituciones?.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? tCommon("loading")
                    : tCommon("save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allProcesses")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={procesos ?? []}
            columns={columns}
            emptyMessage={t("noProcesses")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
