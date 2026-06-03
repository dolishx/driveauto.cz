import Link from "next/link";

import { cn } from "@/lib/cn";

export function Logo({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
} = {}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="DriveAuto domů">
      <span className={cn("flex h-9 w-12 items-center justify-center text-brand-blue", markClassName)}>
        <svg viewBox="0 0 58 36" className="h-8 w-12" aria-hidden="true">
          <path
            d="M3.5 32 18.8 4h7.7L11.2 32H3.5Z"
            fill="currentColor"
          />
          <path
            d="M22.3 4h7.6l-4.8 9.1L35.4 32h-7.8L17.5 13.7 22.3 4Z"
            fill="currentColor"
          />
          <path
            d="M34.3 4H43c7.4 0 12.7 5.3 12.7 13.7S50.4 32 43 32H32.2l3.1-6.1H43c3.9 0 6.2-3.2 6.2-8.2 0-4.8-2.3-7.7-6.2-7.7H31.1L34.3 4Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className={cn("text-2xl font-bold tracking-[-0.03em] text-brand-navy", textClassName)}>
        DriveAuto
      </span>
    </Link>
  );
}
