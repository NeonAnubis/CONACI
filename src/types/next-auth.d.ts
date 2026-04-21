import type { RolSistema, SubRolConaci } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    rolSistema: RolSistema;
    subRolConaci: SubRolConaci | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      rolSistema: RolSistema;
      subRolConaci: SubRolConaci | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rolSistema: RolSistema;
    subRolConaci: SubRolConaci | null;
    name: string;
  }
}
