"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut, ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case "CONACI":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "EVALUADOR":
      return "bg-green-100 text-green-700 border-green-200";
    case "INSTITUCION":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getSubRoleLabel(subRol: string | null): string | null {
  if (!subRol) return null;
  switch (subRol) {
    case "COMITE_DICTAMEN":
      return "Comite de Dictamen";
    case "ADMINISTRADOR":
      return "Administrador";
    default:
      return subRol;
  }
}

export function UserMenu() {
  const { user } = useCurrentUser();
  const t = useTranslations("nav");

  if (!user) return null;

  const initials = getInitials(user.name);
  const subRoleLabel = getSubRoleLabel(user.subRolConaci);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-sky-100 text-sky-700 text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline-flex items-center gap-1">
          <span className="max-w-[120px] truncate font-medium">{user.name}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-start gap-3 py-1">
            <Avatar>
              <AvatarFallback className="bg-sky-100 text-sky-700 text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold",
                    getRoleBadgeClasses(user.rolSistema)
                  )}
                >
                  {user.rolSistema}
                </Badge>
                {subRoleLabel && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium"
                  >
                    {subRoleLabel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-destructive cursor-pointer"
        >
          <LogOut className="size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
