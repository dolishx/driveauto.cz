import Image from "next/image";

export function PageHero({
  label,
  title,
  description,
  image,
}: {
  label: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-white">
      <div className="mx-auto grid min-h-[320px] max-w-7xl items-center px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-0">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">{label}</p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-brand-navy md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-brand-muted">{description}</p>
        </div>
        <div className="relative mt-8 h-64 overflow-hidden rounded-2xl lg:mt-0 lg:h-[320px] lg:rounded-none">
          <Image
            src={image}
            alt=""
            fill
            priority
            fetchPriority="high"
            loading="eager"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-y-0 left-0 hidden w-1/5 bg-gradient-to-r from-white to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
