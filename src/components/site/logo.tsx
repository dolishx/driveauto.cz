import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoTone = "dark" | "light";

export function Logo({
  className,
  markClassName,
  textClassName,
  tone = "dark",
  showSilhouette = false,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  tone?: LogoTone;
  showSilhouette?: boolean;
} = {}) {
  const isLight = tone === "light";

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label="DriveAuto domů">
      <span
        className={cn(
          "relative flex h-10 w-12 shrink-0 items-center justify-center rounded-[10px] border border-brand-line bg-white shadow-sm",
          isLight && "border-white/15 bg-white/10 shadow-none",
          markClassName,
        )}
      >
        <DriveAutoMonogram tone={tone} className="h-7 w-10" />
      </span>
      <span className={cn("leading-none", textClassName)}>
        {showSilhouette ? (
          <CarSilhouette
            className={cn(
              "mb-0.5 h-4 w-36",
              isLight ? "text-white" : "text-brand-black",
            )}
          />
        ) : null}
        <DriveAutoWordmark tone={tone} className="text-[1.35rem] sm:text-[1.48rem]" />
      </span>
    </Link>
  );
}

export function DriveAutoWordmark({ className, tone = "dark" }: { className?: string; tone?: LogoTone }) {
  const isLight = tone === "light";

  return (
    <span
      className={cn(
        "inline-flex items-baseline font-extrabold uppercase leading-none",
        className,
      )}
      aria-hidden="true"
    >
      <span className={isLight ? "text-white" : "text-brand-black"}>DRIVE</span>
      <span className="text-brand-blue italic">AUTO</span>
    </span>
  );
}

export function DriveAutoMonogram({ className, tone = "dark" }: { className?: string; tone?: LogoTone }) {
  const isLight = tone === "light";

  return (
    <svg viewBox="0 0 86 54" className={className} aria-hidden="true" role="img">
      <path
        d="M7 42.5H27.5C40 42.5 48.5 34.5 48.5 23.5C48.5 12.9 40.4 6.5 28.3 6.5H12.4L7 17.1H27.2C32.8 17.1 36.2 20.1 36.2 25C36.2 30.3 32.6 33.5 26.7 33.5H12.1L7 42.5Z"
        fill={isLight ? "#FFFFFF" : "#0D0D0D"}
      />
      <path
        d="M43.2 42.5L66.3 6.5H79.5L81.5 42.5H68.7L68.4 36.7H55.1L51.5 42.5H43.2ZM60.4 28.1H68L67.4 17.3L60.4 28.1Z"
        fill="#1E40AF"
      />
      <path
        d="M14.5 4.4H40.8C46.8 4.4 51.9 5.8 55.7 8.7"
        fill="none"
        stroke={isLight ? "#FFFFFF" : "#0D0D0D"}
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 42" className={className} aria-hidden="true">
      <path
        d="M8 32C34 13 63 6 91 9C110 11 130 14 151 8C166 3 185 6 203 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M88 8C105 6 121 8 139 12C126 14 115 16 102 15"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M58 31C62 23 76 23 82 31"
        fill="none"
        stroke="#1E40AF"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M151 31C156 23 171 23 177 31"
        fill="none"
        stroke="#1E40AF"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}
