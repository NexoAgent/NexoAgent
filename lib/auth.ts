import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
          await prisma.usuario.create({
            data: {
              email: profile.email,
              nombre: profile.name || profile.email.split("@")[0],
              image: profile.picture,
              emailVerified: new Date(),
              rol: "CLIENTE",
            },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      // Con database strategy, NextAuth pasa el user desde la DB
      if (session.user && user) {
        const dbUser = await prisma.usuario.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.rol = dbUser.rol;
          session.user.empresaId = dbUser.empresaId;
          session.user.name = dbUser.nombre;
          session.user.email = dbUser.email;
          session.user.image = dbUser.image;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
});
