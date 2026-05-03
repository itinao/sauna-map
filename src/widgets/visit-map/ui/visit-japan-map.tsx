"use client";

import { useEffect, useRef, useState } from "react";
import { PREFECTURES } from "@/entities/prefecture-visit";
import { GEOLONIA_PREFECTURE_PATHS } from "../model/geolonia-prefecture-paths";

type VisitJapanMapProps = {
  visitsByPrefectureCode: Record<number, number>;
};

type LabelPosition = {
  height: number;
  width: number;
  x: number;
  y: number;
};

const MAX_VISIT_COUNT = 30;
const MAP_VIEW_BOX = "0 0 1000 1000";
const PREFECTURES_BY_CODE = new Map(
  PREFECTURES.map((prefecture) => [prefecture.code, prefecture]),
);

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

function getShortPrefectureName(name: string) {
  return name.replace(/[都府県]$/, "");
}

export function VisitJapanMap({ visitsByPrefectureCode }: VisitJapanMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [labelPositions, setLabelPositions] = useState<
    Record<number, LabelPosition>
  >({});

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const nextPositions = Object.fromEntries(
      Array.from(
        svg.querySelectorAll<SVGPathElement>(".visit-map-prefecture"),
      ).map((path) => {
        const prefectureCode = Number(path.dataset.prefectureCode);
        const box = path.getBBox();

        return [
          prefectureCode,
          {
            height: box.height,
            width: box.width,
            x: box.x + box.width / 2,
            y: box.y + box.height / 2,
          },
        ];
      }),
    );

    setLabelPositions(nextPositions);
  }, []);

  return (
    <div className="flex h-full min-h-[540px] flex-col justify-between gap-5 lg:min-h-[660px]">
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <svg
          ref={svgRef}
          aria-label="都道府県ごとの訪問回数"
          className="h-full max-h-[760px] min-h-[500px] w-full max-w-[760px]"
          role="img"
          viewBox={MAP_VIEW_BOX}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>都道府県ごとの訪問回数</title>
          <desc>
            訪問回数が多い都道府県ほど濃い青色で表示しています。
          </desc>
          <path
            aria-hidden="true"
            d="M108 430 H220 V570 H108"
            fill="none"
            stroke="#94a3b8"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={4}
          />
          {GEOLONIA_PREFECTURE_PATHS.map((prefecturePath) => {
            const prefecture = PREFECTURES_BY_CODE.get(prefecturePath.code);
            const visitCount =
              visitsByPrefectureCode[prefecturePath.code] ?? 0;
            const labelPosition = labelPositions[prefecturePath.code];
            const isDark = visitCount >= MAX_VISIT_COUNT / 2;
            const label = prefecture
              ? getShortPrefectureName(prefecture.name)
              : "";
            const fontSize = labelPosition
              ? Math.min(
                  22,
                  Math.max(
                    10,
                    Math.min(
                      labelPosition.height * 0.45,
                      labelPosition.width / Math.max(label.length * 0.9, 1),
                    ),
                  ),
                )
              : 22;

            return (
              <g
                key={prefecturePath.code}
                aria-label={`${prefecture?.name ?? prefecturePath.code}: ${visitCount}回`}
              >
                <path
                  className="visit-map-prefecture transition-colors"
                  d={prefecturePath.d}
                  data-prefecture-code={prefecturePath.code}
                  fill={getVisitColor(visitCount)}
                  stroke="#ffffff"
                  strokeLinejoin="round"
                  strokeWidth={6}
                />
                {prefecture && labelPosition ? (
                  <text
                    aria-hidden="true"
                    dominantBaseline="middle"
                    fill={isDark ? "#ffffff" : "#0f172a"}
                    fontSize={fontSize}
                    fontWeight={700}
                    pointerEvents="none"
                    textAnchor="middle"
                    x={labelPosition.x}
                    y={labelPosition.y}
                  >
                    {label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span>0回</span>
        <div className="h-2 rounded-full bg-gradient-to-r from-[#e8f2ff] to-[#1455aa]" />
        <span>30回以上</span>
      </div>
    </div>
  );
}
