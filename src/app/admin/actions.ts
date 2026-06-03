"use server";

import { redirect } from "next/navigation";

import { clearAdminSessionCookie, setAdminSessionCookie, verifyAdminPassword } from "@/lib/admin-auth";

export type AdminLoginState = {
  error?: string;
};

export async function loginAdmin(_state: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return { error: "Nesprávné heslo." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin");
}
