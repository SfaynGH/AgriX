"use client";

import { useAtomValue } from "jotai";
import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { soilMoistureDataAtom } from "@/lib/atoms";
import type { SoilMoistureMetric } from "@/types/types";

const generateSpec = (data: SoilMoistureMetric[]): IBarChartSpec => ({
  type: "bar",
  data: [
    {
      id: "barData",
      values: data,
    },
  ],
  xField: "date",
  yField: "moisture",
  padding: [10, 0, 10, 0],
  legends: {
    visible: false,
  },
  stack: false,
  tooltip: {
    trigger: ["click", "hover"],
  },
  bar: {
    state: {
      hover: {
        outerBorder: {
          distance: 2,
          lineWidth: 2,
        },
      },
    },
    style: {
      cornerRadius: [12, 12, 12, 12],
      zIndex: () => 1,
    },
  },
});

export default function Chart() {
  const soilMoistureData = useAtomValue(soilMoistureDataAtom);
  const spec = generateSpec(soilMoistureData);
  return <VChart spec={spec} />;
}