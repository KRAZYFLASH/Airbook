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
    countryId: "country-id-1",
    country: { name: "Indonesia" },
    logo: "https://logo.clearbit.com/garuda-indonesia.com",
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    code: "QZ",
    name: "Indonesia AirAsia",
    countryId: "country-id-1",
    country: { name: "Indonesia" },
    logo: "https://logo.clearbit.com/airasia.com",
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    code: "JT",
    name: "Lion Air",
    countryId: "country-id-1",
    country: { name: "Indonesia" },
    logo: "https://logo.clearbit.com/lionair.co.id",
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
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
    classType: "ECONOMY",
    availableSeats: 180,
    totalSeats: 180,
    basePrice: 1450000,
    currentPrice: 1450000,
    status: "SCHEDULED",
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    airlineId: airlines[1]?.id || "",
    flightNo: "QZ-7521",
    origin: "SUB",
    destination: "KUL",
    departure: new Date(Date.now() + 2 * 86400000).toISOString(),
    arrival: new Date(Date.now() + 2 * 86400000 + 3 * 3600000).toISOString(),
    classType: "ECONOMY",
    availableSeats: 156,
    totalSeats: 156,
    basePrice: 980000,
    currentPrice: 980000,
    status: "DELAYED",
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

export const seedPromos: Promo[] = [
  {
    id: uid(),
    title: "Oktober Hemat",
    description: "Min. transaksi Rp500.000. Berlaku rute domestik.",
    code: "OKTHEMAT20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    usedCount: 0,
    isActive: true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    title: "Libur Nataru",
    description: "Tidak berlaku untuk rute international premium.",
    code: "NATARU10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    startDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    usedCount: 0,
    isActive: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];
