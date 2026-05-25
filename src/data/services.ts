import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "financovani",
    title: "Financování",
    description:
      "Možnost financování připravujeme. Služba bude dostupná až po dokončení spolupráce s finančními partnery.",
    href: "/sluzby#financovani",
    badge: "Připravujeme",
  },
  {
    id: "vykup",
    title: "Výkup vozu",
    description: "Vykoupíme váš vůz rychle, férově a za nejlepší možnou cenu.",
    href: "/sluzby#vykup",
  },
  {
    id: "pojisteni",
    title: "Pojištění",
    description: "Zajistíme pro vás výhodné pojištění vozidla během pár minut.",
    href: "/sluzby#pojisteni",
  },
  {
    id: "servis",
    title: "Servis",
    description: "Profesionální servisní péče pro všechny značky vozů.",
    href: "/sluzby#servis",
  },
  {
    id: "dovoz",
    title: "Dovoz vozů",
    description: "Dovezeme vám vůz ze zahraničí podle vašich představ.",
    href: "/sluzby#dovoz",
  },
  {
    id: "garance",
    title: "Garance původu",
    description: "Garantujeme původ vozu a prověřenou servisní historii.",
    href: "/sluzby#garance",
  },
];
