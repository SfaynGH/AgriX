export type SoilMoistureMetric = {
  date: string;
  moisture: number;
};

// src/types/types.ts

export type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};
