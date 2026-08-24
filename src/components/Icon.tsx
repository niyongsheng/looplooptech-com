"use client";

import {
  BadgeCheck,
  Bell,
  Boxes,
  Braces,
  Car,
  ChartBar,
  ChartLine,
  ClipboardCheck,
  DoorOpen,
  Feather,
  FileCheck,
  Globe2,
  Home,
  Layers,
  Microscope,
  PackagePlus,
  Plug,
  ReceiptText,
  Scale,
  Scaling,
  ShieldCheck,
  Sprout,
  TestTube,
  Truck,
  Wrench,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  BadgeCheck,
  Bell,
  Boxes,
  Braces,
  Car,
  ChartBar,
  ChartLine,
  ClipboardCheck,
  DoorOpen,
  Feather,
  FileCheck,
  Globe2,
  Home,
  Layers,
  Microscope,
  PackagePlus,
  Plug,
  ReceiptText,
  Scale,
  Scaling,
  ShieldCheck,
  Sprout,
  TestTube,
  Truck,
  Wrench,
  Workflow,
};

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const Cmp = icons[name];
  if (!Cmp) return null;
  return <Cmp className={className} strokeWidth={1.5} />;
}
