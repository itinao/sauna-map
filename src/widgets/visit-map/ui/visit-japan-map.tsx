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

const MAP_VIEW_BOX = "0 0 1000 1000";
const PREFECTURE_BORDER_COLOR = "#94a3b8";
const PREFECTURE_LABEL_COLOR = "#0f172a";
const PREFECTURE_LABEL_OUTLINE_COLOR = "#ffffff";
const PREFECTURES_BY_CODE = new Map(
  PREFECTURES.map((prefecture) => [prefecture.code, prefecture]),
);
const VISIT_COLOR_STEPS = [
  { color: "#ffffff", label: "0回", max: 0, min: 0 },
  { color: "#dbeafe", label: "1-4回", max: 4, min: 1 },
  { color: "#60a5fa", label: "5-29回", max: 29, min: 5 },
  { color: "#0f2f7f", label: "30回以上", max: Infinity, min: 30 },
] as const;

function getVisitColor(visitCount: number) {
  return (
    VISIT_COLOR_STEPS.find(
      (step) => visitCount >= step.min && visitCount <= step.max,
    )?.color ?? VISIT_COLOR_STEPS[0].color
  );
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
    <div className="flex flex-col justify-between gap-4 sm:gap-5">
      <div className="flex items-center justify-center overflow-hidden">
        <svg
          ref={svgRef}
          aria-label="都道府県ごとの訪問回数"
          className="aspect-square w-full max-w-[760px]"
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
                  stroke={PREFECTURE_BORDER_COLOR}
                  strokeLinejoin="round"
                  strokeWidth={4}
                />
                {prefecture && labelPosition ? (
                  <text
                    aria-hidden="true"
                    dominantBaseline="middle"
                    fill={PREFECTURE_LABEL_COLOR}
                    fontSize={fontSize}
                    fontWeight={700}
                    paintOrder="stroke fill"
                    pointerEvents="none"
                    stroke={PREFECTURE_LABEL_OUTLINE_COLOR}
                    strokeLinejoin="round"
                    strokeWidth={5}
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

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
        {VISIT_COLOR_STEPS.map((step) => (
          <div key={step.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 shrink-0 rounded border border-slate-300"
              style={{ backgroundColor: step.color }}
            />
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
