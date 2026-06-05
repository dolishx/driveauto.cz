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
        <DriveAutoMonogram tone={tone} className="h-7 w-11" />
      </span>
      <span className={cn("leading-none", textClassName)}>
        {showSilhouette ? (
          <CarSilhouette
            className={cn(
              "mb-0.5 h-5 w-44 sm:w-52",
              isLight ? "text-white" : "text-brand-black",
            )}
          />
        ) : null}
        <DriveAutoWordmark tone={tone} className="h-7 w-44 sm:h-8 sm:w-52" />
      </span>
    </Link>
  );
}

export function DriveAutoWordmark({ className, tone = "dark" }: { className?: string; tone?: LogoTone }) {
  const isLight = tone === "light";

  return (
    <svg
      viewBox="0 0 332 54"
      className={cn("block", className)}
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
    >
      <text
        x="0"
        y="41"
        fill={isLight ? "#FFFFFF" : "#0D0D0D"}
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="42"
        fontWeight="900"
        letterSpacing="0"
      >
        DRIVE
      </text>
      <text
        x="148"
        y="41"
        fill="#1E40AF"
        fontFamily="Montserrat, Arial, sans-serif"
        fontSize="42"
        fontStyle="italic"
        fontWeight="900"
        letterSpacing="0"
      >
        AUTO
      </text>
    </svg>
  );
}

export function DriveAutoMonogram({ className, tone = "dark" }: { className?: string; tone?: LogoTone }) {
  const isLight = tone === "light";

  return (
    <svg viewBox="0 0 96 56" className={className} aria-hidden="true" role="img">
      <path
        d="M5.5 45.5H31.8C49.1 45.5 60.8 35.9 60.8 23.4C60.8 11.1 50.2 4.5 34.4 4.5H16.2L10.7 15.6H33.2C41.2 15.6 46.2 19.9 46.2 26.5C46.2 33.8 40.7 38.3 31.3 38.3H9.2L5.5 45.5Z"
        fill={isLight ? "#FFFFFF" : "#0D0D0D"}
      />
      <path
        d="M47.2 45.5L74.1 4.5H89.6L93.5 45.5H79.7L79.1 38H63.3L58.6 45.5H47.2ZM69 28.7H78.3L77.5 15.8L69 28.7Z"
        fill="#1E40AF"
      />
      <path
        d="M17.2 1.8H44.8C56.8 1.8 66 4.6 72.2 10.2"
        fill="none"
        stroke={isLight ? "#FFFFFF" : "#0D0D0D"}
        strokeLinecap="round"
        strokeWidth="4.6"
      />
    </svg>
  );
}

export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 58" className={className} aria-hidden="true" preserveAspectRatio="xMinYMid meet">
      <path
        d="M10 43C43 22 82 10 119 12C147 13.5 164 23 194 14.5C221 6.7 247 12.2 270 27.5C248.5 25.8 229 25.7 210.5 27.5C188 29.7 173 31 149 26.8C125 22.6 103.5 21.6 78 27.5C53.2 33.2 32.2 38.8 10 43Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M107 12C130 8.5 151 10.5 178 17.2C159.5 18.6 145.6 21.5 125.2 20.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4.2"
      />
      <path
        d="M70 40C76 29.5 93 29.5 100 40"
        fill="none"
        stroke="#1E40AF"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M197 40C204 29.5 222 29.5 230 40"
        fill="none"
        stroke="#1E40AF"
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  );
}
