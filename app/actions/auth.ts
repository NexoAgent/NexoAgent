"use server";

import { signIn, signOut } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
