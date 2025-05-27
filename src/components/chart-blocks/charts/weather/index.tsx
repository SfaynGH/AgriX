import { Sun } from "lucide-react";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function Convertions() {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Weather" icon={Sun} />
      <div className="flex flex-wrap w-full">
        <div className="relative w-full max-w-[900px] h-[50vh] min-h-[300px] max-h-[500px] flex-1 overflow-hidden">
          <Chart />
        </div>
      </div>
    </section>
  );
}