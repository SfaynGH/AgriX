import { Gauge, type LucideIcon, Heart, MessageSquare } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Plant monitor",
  description: "Plant monitoring system",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: Heart,
    name: "Plant Health",
    href: "/Monitor",
  },
  {
    icon: MessageSquare,
    name: "Chatbot",
    href: "/chatbot",
  },
];
