"use client";

import { useAtomValue } from "jotai";
import { Droplet } from "lucide-react";
import { soilMoistureDataAtom } from "@/lib/atoms";
import type { SoilMoistureMetric } from "@/types/types";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";
import { DatePickerWithRange } from "./components/date-range-picker";
import MetricCard from "./components/metric-card";

const calMetricCardValue = (data: SoilMoistureMetric[]) => {
  return Math.round(
    data.reduce((acc, curr) => acc + curr.moisture, 0) / data.length,
  );
};

export default function AverageSoilMoisture() {
  const soilMoistureData = useAtomValue(soilMoistureDataAtom);
  const avgMoisture = calMetricCardValue(soilMoistureData);

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ChartTitle title="Soil Moisture" icon={Droplet} />
        <DatePickerWithRange className="" />
      </div>
      <div className="flex flex-wrap">
        <div className="relative h-96 min-w-[320px] flex-1">
          <Chart />
        </div>
      </div>
    </section>
  );
}