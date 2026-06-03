"use client";

import { LockKeyhole } from "lucide-react";
import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/actions";
import type { AdminLoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-7 grid gap-4">
      <div>
        <label htmlFor="admin-password" className="text-sm font-bold text-brand-navy">
          Heslo administrace
        </label>
        <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-brand-line bg-white px-4 shadow-sm focus-within:border-brand-blue/55 focus-within:ring-4 focus-within:ring-brand-blue/10">
          <LockKeyhole className="h-4 w-4 text-brand-blue" />
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-brand-navy outline-none placeholder:text-brand-muted"
            placeholder="Zadejte heslo"
          />
        </div>
      </div>

      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Ověřuji..." : "Vstoupit do administrace"}
      </Button>
    </form>
  );
}
