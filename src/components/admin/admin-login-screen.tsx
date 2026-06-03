import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";

export function AdminLoginScreen() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-brand-navy sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-brand-navy p-7 text-white sm:p-10">
            <Logo markClassName="text-white" textClassName="text-white" />
            <div className="mt-16 max-w-md">
              <span className="flex h-13 w-13 items-center justify-center rounded-full bg-white/10 text-white">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <p className="mt-7 text-sm font-bold uppercase tracking-wide text-blue-200">DriveAuto Admin</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Přístup do administrace
              </h1>
              <p className="mt-4 text-sm leading-6 text-blue-100">
                Administrace je v MVP režimu chráněná jednoduchým heslem. Plná správa uživatelů bude doplněna v další fázi.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Ověření správce</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em]">Zadejte heslo</h2>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                Po ověření se otevře přehled vozů, poptávek a žádostí o prohlídku.
              </p>

              <AdminLoginForm />

              <div className="mt-5 border-t border-brand-line pt-5">
                <ButtonLink href="/" variant="secondary" className="h-11 w-full">
                  Zpět na web
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
