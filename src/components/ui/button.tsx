import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-blue text-white shadow-[0_14px_26px_rgba(7,95,232,0.22)] hover:bg-brand-blue-dark",
  secondary:
    "border border-brand-line bg-white text-brand-navy shadow-sm hover:border-brand-blue/30 hover:bg-brand-soft",
  ghost: "text-brand-navy hover:bg-brand-soft",
};

export function buttonClasses(variant: ButtonVariant = "primary") {
  return cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
    variantClasses[variant],
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonClasses(variant), className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: ButtonVariant }) {
  return (
    <button className={cn(buttonClasses(variant), className)} {...props} />
  );
}
