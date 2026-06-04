import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: "PROVEEDOR" | "CLIENTE";
      empresaId: string | null;
      requiereCambioPassword?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    rol: "PROVEEDOR" | "CLIENTE";
    empresaId: string | null;
    requiereCambioPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rol: "PROVEEDOR" | "CLIENTE";
    empresaId: string | null;
    requiereCambioPassword?: boolean;
  }
}
