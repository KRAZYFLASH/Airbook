// =============================================================
// AirBook Admin — Utils
// =============================================================

export const uid = () => crypto.randomUUID();
export const nowISO = () => new Date().toISOString();

export function clsx(...xs: (string | false | undefined | null)[]) {
  return xs.filter(Boolean).join(" ");
}

export function rupiah(n: number) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rp ${n.toLocaleString("id-ID")}`;
  }
}

// localStorage keys
export const LS_KEYS = {
  airlines: "airbook_admin_airlines_v2",
  schedules: "airbook_admin_schedules_v2",
  promos: "airbook_admin_promos_v2",
};

import { useState, useEffect } from "react";
import type { Airline, FlightSchedule, Promo } from "./types";

export function useLocalArray<T>(key: string, seed: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : seed;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);
  return [data, setData] as const;
}

// ============== Seeds =================
export const seedAirlines: Airline[] = [
  {
    id: uid(),
    code: "GA",
    name: "Garuda Indonesia",
    country: "Indonesia",
    logoUrl: "https://logo.clearbit.com/garuda-indonesia.com",
    active: true,
    createdAt: nowISO(),
  },
  {
    id: uid(),
    code: "QZ",
    name: "Indonesia AirAsia",
    country: "Indonesia",
    logoUrl: "https://logo.clearbit.com/airasia.com",
    active: true,
    createdAt: nowISO(),
  },
  {
    id: uid(),
    code: "JT",
    name: "Lion Air",
    country: "Indonesia",
    logoUrl: "https://logo.clearbit.com/lionair.co.id",
    active: true,
    createdAt: nowISO(),
  },
];

export const seedSchedules = (airlines: Airline[]): FlightSchedule[] => [
  {
    id: uid(),
    airlineId: airlines[0]?.id || "",
    flightNo: "GA-410",
    origin: "CGK",
    destination: "DPS",
    departure: new Date(Date.now() + 86400000).toISOString(),
    arrival: new Date(Date.now() + 86400000 + 2.5 * 3600000).toISOString(),
    basePrice: 1450000,
    seats: 180,
    status: "ON_TIME",
    createdAt: nowISO(),
  },
  {
    id: uid(),
    airlineId: airlines[1]?.id || "",
    flightNo: "QZ-7521",
    origin: "SUB",
    destination: "KUL",
    departure: new Date(Date.now() + 2 * 86400000).toISOString(),
    arrival: new Date(Date.now() + 2 * 86400000 + 3 * 3600000).toISOString(),
    basePrice: 980000,
    seats: 156,
    status: "DELAYED",
    createdAt: nowISO(),
  },
];

export const seedPromos: Promo[] = [
  {
    id: uid(),
    title: "Oktober Hemat",
    code: "OKTHEMAT20",
    discountPercent: 20,
    startsAt: new Date().toISOString().slice(0, 10),
    endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    conditions: "Min. transaksi Rp500.000. Berlaku rute domestik.",
    active: true,
    createdAt: nowISO(),
  },
  {
    id: uid(),
    title: "Libur Nataru",
    code: "NATARU10",
    discountPercent: 10,
    startsAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    endsAt: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    conditions: "Tidak berlaku untuk rute international premium.",
    active: false,
    createdAt: nowISO(),
  },
];
