"use client";

import Japan from "@react-map/japan";
import { PREFECTURES } from "@/entities/prefecture-visit";

type VisitJapanMapProps = {
  visitsByPrefectureCode: Record<number, number>;
};

const MAX_VISIT_COUNT = 30;

function getVisitColor(visitCount: number) {
  const cappedCount = Math.min(Math.max(visitCount, 0), MAX_VISIT_COUNT);
  const ratio = cappedCount / MAX_VISIT_COUNT;
  const light = [232, 242, 255];
  const dark = [20, 85, 170];
  const rgb = light.map((channel, index) =>
    Math.round(channel + (dark[index] - channel) * ratio),
  );

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function VisitJapanMap({ visitsByPrefectureCode }: VisitJapanMapProps) {
  const cityColors = Object.fromEntries(
    PREFECTURES.map((prefecture) => [
      prefecture.mapKey,
      getVisitColor(visitsByPrefectureCode[prefecture.code] ?? 0),
    ]),
  );

  return (
    <div className="flex h-full min-h-[460px] flex-col justify-between gap-5">
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <Japan
          type="select-single"
          size={520}
          mapColor="#e8f2ff"
          strokeColor="#ffffff"
          strokeWidth={0.75}
          hoverColor="#2f6ec7"
          cityColors={cityColors}
          disableClick
        />
      </div>

      <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span>0回</span>
        <div className="h-2 rounded-full bg-gradient-to-r from-[#e8f2ff] to-[#1455aa]" />
        <span>30回以上</span>
      </div>
    </div>
  );
}
