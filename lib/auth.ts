import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
          include: { empresa: true },
        });

        if (!usuario) {
          return null;
        }

        // Si el usuario no tiene password (es OAuth), no puede hacer login con credentials
        if (!usuario.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          usuario.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          rol: usuario.rol,
          empresaId: usuario.empresaId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Si es login con Google, asegurar que el usuario tenga los campos necesarios
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await prisma.usuario.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          // Crear usuario desde Google
          const newUser = await prisma.usuario.create({
            data: {
              email: profile.email,
              nombre: profile.name || profile.email.split("@")[0],
              image: profile.picture,
              emailVerified: new Date(),
              rol: "CLIENTE",
            },
          });
          // Asignar el ID al user para que esté disponible en jwt callback
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // En el primer login, agregar info del usuario al token
      if (user) {
        const dbUser = await prisma.usuario.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.rol = dbUser.rol;
          token.empresaId = dbUser.empresaId;
          token.nombre = dbUser.nombre;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar info del token a la sesión
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as "PROVEEDOR" | "CLIENTE";
        session.user.empresaId = token.empresaId as string | null;
        session.user.name = token.nombre as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
});
