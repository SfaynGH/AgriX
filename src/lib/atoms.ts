import { addDays, endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { atom } from "jotai";
import type { DateRange } from "react-day-picker";
import { soilMoistureData } from "@/data/soil-moisture-data";
import type { SoilMoistureMetric } from "@/types/types";

const defaultStartDate = new Date(2024, 1, 1);

export const dateRangeAtom = atom<DateRange | undefined>({
  from: defaultStartDate,
  to: addDays(defaultStartDate, 6),
});

export const soilMoistureDataAtom = atom((get) => {
  const dateRange = get(dateRangeAtom);

  if (!dateRange?.from || !dateRange?.to) return [];

  const startDate = startOfDay(dateRange.from);
  const endDate = endOfDay(dateRange.to);

  return soilMoistureData
    .filter((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return isWithinInterval(date, { start: startDate, end: endDate });
    })
    .map((item) => ({
      date: item.date,
      moisture: item.moisture,
    }));
});
