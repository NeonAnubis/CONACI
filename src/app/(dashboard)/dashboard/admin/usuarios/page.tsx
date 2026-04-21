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
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

type Usuario = {
  id: string;
  name: string;
  email: string;
  rolSistema: string;
  subRolConaci: string | null;
  rolInstitucion: string | null;
  activo: boolean;
  createdAt: string;
};

const rolColors: Record<string, string> = {
  CONACI: "bg-sky-100 text-sky-700",
  EVALUADOR: "bg-emerald-100 text-emerald-700",
  INSTITUCION: "bg-amber-100 text-amber-700",
};

const rolKeyMap: Record<string, string> = {
  CONACI: "conaci",
  EVALUADOR: "evaluador",
  INSTITUCION: "institucion",
};

const subRolKeyMap: Record<string, string> = {
  COMITE_DICTAMEN: "comiteDictamen",
  ADMINISTRADOR: "administrador",
};

const rolInstKeyMap: Record<string, string> = {
  COORDINADOR: "coordinador",
  RESPONSABLE: "responsable",
};

type FormData = {
  name: string;
  email: string;
  password: string;
  rolSistema: string;
  subRolConaci: string;
  rolInstitucion: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  password: "",
  rolSistema: "INSTITUCION",
  subRolConaci: "",
  rolInstitucion: "",
};

export default function UsuariosAdminPage() {
  const t = useTranslations("admin");
  const tRoles = useTranslations("roles");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormData>(emptyForm);

  const { data: usuarios, isLoading } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          rolSistema: data.rolSistema,
          subRolConaci: data.subRolConaci || null,
          rolInstitucion: data.rolInstitucion || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(t("saved"));
      setDialogOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message || t("errorSaving")),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; rolSistema: string; subRolConaci: string | null; rolInstitucion: string | null; activo: boolean }>;
    }) => {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(t("saved"));
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error(t("errorSaving")),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function openEdit(u: Usuario) {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      rolSistema: u.rolSistema,
      subRolConaci: u.subRolConaci ?? "",
      rolInstitucion: u.rolInstitucion ?? "",
    });
    setDialogOpen(true);
  }

  function handleToggleActive(u: Usuario) {
    updateMutation.mutate({
      id: u.id,
      data: { activo: !u.activo },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: {
          name: form.name,
          rolSistema: form.rolSistema,
          subRolConaci: form.subRolConaci || null,
          rolInstitucion: form.rolInstitucion || null,
        },
      });
    } else {
      createMutation.mutate(form);
    }
  }

  function getSubRoleLabel(u: Usuario): string {
    if (u.subRolConaci && subRolKeyMap[u.subRolConaci]) {
      return tRoles(subRolKeyMap[u.subRolConaci] as "comiteDictamen" | "administrador");
    }
    if (u.rolInstitucion && rolInstKeyMap[u.rolInstitucion]) {
      return tRoles(rolInstKeyMap[u.rolInstitucion] as "coordinador" | "responsable");
    }
    return "-";
  }

  const columns: Column<Usuario>[] = [
    { key: "name", header: tCommon("name") },
    { key: "email", header: t("email") },
    {
      key: "rolSistema",
      header: t("role"),
      render: (row) => (
        <Badge className={rolColors[row.rolSistema] ?? ""}>
          {tRoles(rolKeyMap[row.rolSistema] as "conaci" | "evaluador" | "institucion")}
        </Badge>
      ),
    },
    {
      key: "subRole",
      header: t("subRole"),
      sortable: false,
      searchable: false,
      render: (row) => getSubRoleLabel(row),
    },
    {
      key: "activo",
      header: t("status"),
      render: (row) => (
        <Badge className={row.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
          {row.activo ? t("active") : t("inactive")}
        </Badge>
      ),
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
            size="xs"
            onClick={() => handleToggleActive(row)}
          >
            {row.activo ? t("deactivateUser") : t("activateUser")}
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
        <h1 className="text-2xl font-bold tracking-tight">{tNav("gestionUsuarios")}</h1>
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
            {t("addUser")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? t("editUser") : t("addUser")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>{tCommon("name")}</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              {!editingId && (
                <>
                  <div className="space-y-1">
                    <Label>{t("email")}</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t("password")}</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={8}
                    />
                  </div>
                </>
              )}
              <div className="space-y-1">
                <Label>{t("role")}</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                  value={form.rolSistema}
                  onChange={(e) =>
                    setForm({ ...form, rolSistema: e.target.value, subRolConaci: "", rolInstitucion: "" })
                  }
                >
                  <option value="INSTITUCION">{tRoles("institucion")}</option>
                  <option value="EVALUADOR">{tRoles("evaluador")}</option>
                  <option value="CONACI">{tRoles("conaci")}</option>
                </select>
              </div>
              {form.rolSistema === "CONACI" && (
                <div className="space-y-1">
                  <Label>{t("subRole")}</Label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                    value={form.subRolConaci}
                    onChange={(e) => setForm({ ...form, subRolConaci: e.target.value })}
                  >
                    <option value="">{tCommon("optional")}</option>
                    <option value="ADMINISTRADOR">{tRoles("administrador")}</option>
                    <option value="COMITE_DICTAMEN">{tRoles("comiteDictamen")}</option>
                  </select>
                </div>
              )}
              {form.rolSistema === "INSTITUCION" && (
                <div className="space-y-1">
                  <Label>{t("subRole")}</Label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                    value={form.rolInstitucion}
                    onChange={(e) => setForm({ ...form, rolInstitucion: e.target.value })}
                  >
                    <option value="">{tCommon("optional")}</option>
                    <option value="COORDINADOR">{tRoles("coordinador")}</option>
                    <option value="RESPONSABLE">{tRoles("responsable")}</option>
                  </select>
                </div>
              )}
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
          <CardTitle>{t("allUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={usuarios ?? []}
            columns={columns}
            emptyMessage={t("noUsers")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
