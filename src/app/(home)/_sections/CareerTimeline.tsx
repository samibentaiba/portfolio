// src/app/(home)/_sections/CareerTimeline.tsx
"use client";

import React, { memo, useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { CareerBranch, CareerPoint } from "@/types";

// Constants
const CELL_WIDTH = 100;
const LANE_HEIGHT = 100;

// Helper function
const getNodeRadius = (size: 'small' | 'medium' | 'large'): number => {
  const sizeMap = { small: 5, medium: 8, large: 12 };
  return sizeMap[size];
};

// Filters Component
const TimelineFilters = memo(function TimelineFilters({
  branches,
  visibleBranches,
  sizeFilter,
  onToggleBranch,
  onToggleSize,
  t
}: {
  branches: CareerBranch[];
  visibleBranches: Set<string>;
  sizeFilter: Set<string>;
  onToggleBranch: (id: string) => void;
  onToggleSize: (size: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div>
        <h3 className="text-sm font-semibold mb-3">{t("careerTimeline.showBranches")}</h3>
        <div className="flex flex-wrap gap-3">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => onToggleBranch(branch.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${visibleBranches.has(branch.id)
                ? 'bg-primary/10 text-foreground border border-primary/20'
                : 'bg-muted text-muted-foreground border border-border opacity-50'
                }`}
              aria-pressed={visibleBranches.has(branch.id)}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: branch.color,
                  boxShadow: visibleBranches.has(branch.id) ? `0 0 6px ${branch.color}` : 'none'
                }}
                aria-hidden="true"
              />
              {branch.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">{t("careerTimeline.filterBySize")}</h3>
        <div className="flex flex-wrap gap-3">
          {(['small', 'medium', 'large'] as const).map(size => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${sizeFilter.has(size)
                ? 'bg-primary/10 text-foreground border border-primary/20'
                : 'bg-muted text-muted-foreground border border-border opacity-50'
                }`}
              aria-pressed={sizeFilter.has(size)}
            >
              <span
                className="inline-block rounded-full mr-2"
                style={{
                  width: size === 'small' ? '6px' : size === 'medium' ? '8px' : '12px',
                  height: size === 'small' ? '6px' : size === 'medium' ? '8px' : '12px',
                  backgroundColor: 'currentColor',
                }}
                aria-hidden="true"
              />
              {t(`careerTimeline.${size}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// Tooltip Component (rendered outside SVG)
const Tooltip = memo(function Tooltip({
  point,
  position,
  color,
  isMobile,
}: {
  point: CareerPoint;
  position: { x: number; y: number };
  color: string;
  isMobile: boolean;
}) {
  // Adjust tooltip position for mobile to prevent overflow
  const tooltipStyle = useMemo(() => {
    if (isMobile) {
      return {
        left: '50%',
        top: `${position.y - 80}px`,
        transform: 'translateX(-50%)',
      };
    }
    return {
      left: `${position.x + 20}px`,
      top: `${position.y - 40}px`,
    };
  }, [position, isMobile]);

  return (
    <div
      className="absolute pointer-events-none z-[9999]"
      style={tooltipStyle}
    >
      <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-xl border border-border min-w-[200px] max-w-[280px] sm:max-w-[250px]">
        <div className="flex items-start gap-2">
          <div
            className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1 leading-tight">{point.milestone.title}</h4>
            <p className="text-xs text-muted-foreground mb-1 leading-snug">{point.milestone.description}</p>
            {point.milestone.date && (
              <p className="text-xs text-muted-foreground font-medium mt-1">{point.milestone.date}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Timeline Visualization Component
const TimelineVisualization = memo(function TimelineVisualization({
  adjustedBranches,
  hoveredPoint,
  hoveredBranch,
  hoveredLink,
  onPointHover,
  onBranchHover,
  onLinkHover,
}: {
  adjustedBranches: CareerBranch[];
  hoveredPoint: string | null;
  hoveredBranch: string | null;
  hoveredLink: string | null;
  onPointHover: (id: string | null) => void;
  onBranchHover: (id: string | null) => void;
  onLinkHover: (id: string | null) => void;
}) {
  // Detect if mobile
  const [isMobile, setIsMobile] = useState(false);
  const [clickedPoint, setClickedPoint] = useState<string | null>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate positions
  const { svgWidth, svgHeight, branchYPositions, pointPositions } = useMemo(() => {
    const allXPositions = new Set<number>();
    adjustedBranches.forEach(branch => {
      branch.points.forEach(point => allXPositions.add(point.x));
    });

    const maxX = Math.max(...Array.from(allXPositions), 0);
    const width = (maxX + 1) * CELL_WIDTH + 100;
    const height = adjustedBranches.length * LANE_HEIGHT + 100;

    const yPositions: Record<string, number> = {};
    adjustedBranches.forEach((branch, idx) => {
      yPositions[branch.id] = 50 + idx * LANE_HEIGHT;
    });

    const pPositions: Record<string, { x: number; y: number; branch: string; color: string }> = {};
    adjustedBranches.forEach(branch => {
      branch.points.forEach(point => {
        pPositions[point.id] = {
          x: 60 + point.x * CELL_WIDTH,
          y: yPositions[branch.id],
          branch: branch.id,
          color: branch.color,
        };
      });
    });

    return {
      svgWidth: width,
      svgHeight: height,
      branchYPositions: yPositions,
      pointPositions: pPositions,
    };
  }, [adjustedBranches]);

  // Render branch lines
  const renderBranchLines = useCallback((branch: CareerBranch) => {
    const branchY = branchYPositions[branch.id];
    const sortedPoints = [...branch.points].sort((a, b) => a.x - b.x);

    return sortedPoints.slice(0, -1).map((currentPoint, i) => {
      const nextPoint = sortedPoints[i + 1];
      const x1 = 60 + currentPoint.x * CELL_WIDTH;
      const x2 = 60 + nextPoint.x * CELL_WIDTH;
      const isHovered = hoveredBranch === branch.id;

      return (
        <line
          key={`line-${branch.id}-${i}`}
          x1={x1}
          y1={branchY}
          x2={x2}
          y2={branchY}
          stroke={branch.color}
          strokeWidth={isHovered ? 3 : 2}
          opacity={isHovered ? 1 : 0.6}
          className="transition-all duration-200"
          onMouseEnter={() => onBranchHover(branch.id)}
          onMouseLeave={() => onBranchHover(null)}
        />
      );
    });
  }, [branchYPositions, hoveredBranch, onBranchHover]);

  // Render connections
  const renderConnections = useCallback(() => {
    const lines: React.ReactElement[] = [];
    const drawnLinks = new Set<string>();

    adjustedBranches.forEach(branch => {
      branch.points.forEach(point => {
        point.linkedTo?.forEach(link => {
          const linkedId = link.targetId;
          const linkKey = [point.id, linkedId].sort().join('-');

          if (drawnLinks.has(linkKey)) return;
          drawnLinks.add(linkKey);

          const fromPos = pointPositions[point.id];
          const toPos = pointPositions[linkedId];

          if (!fromPos || !toPos) return;

          const isHovered = hoveredLink === linkKey || hoveredPoint === point.id || hoveredPoint === linkedId;
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;

          let pathD = '';
          const verticalDistance = Math.abs(dy);
          const cornerSize = Math.min(20, verticalDistance / 2, Math.abs(dx) / 2);

          if (dy > 0) {
            const midY = fromPos.y + verticalDistance / 2;
            pathD = `M ${fromPos.x} ${fromPos.y} 
                     L ${fromPos.x} ${midY - cornerSize}
                     Q ${fromPos.x} ${midY} ${fromPos.x + (dx > 0 ? cornerSize : -cornerSize)} ${midY}
                     L ${toPos.x - (dx > 0 ? cornerSize : -cornerSize)} ${midY}
                     Q ${toPos.x} ${midY} ${toPos.x} ${midY + cornerSize}
                     L ${toPos.x} ${toPos.y}`;
          } else if (dy < 0) {
            const midY = fromPos.y - verticalDistance / 2;
            pathD = `M ${fromPos.x} ${fromPos.y} 
                     L ${fromPos.x} ${midY + cornerSize}
                     Q ${fromPos.x} ${midY} ${fromPos.x + (dx > 0 ? cornerSize : -cornerSize)} ${midY}
                     L ${toPos.x - (dx > 0 ? cornerSize : -cornerSize)} ${midY}
                     Q ${toPos.x} ${midY} ${toPos.x} ${midY - cornerSize}
                     L ${toPos.x} ${toPos.y}`;
          } else {
            pathD = `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;
          }

          lines.push(
            <path
              key={linkKey}
              d={pathD}
              fill="none"
              stroke={branch.color}
              strokeWidth={isHovered ? 3 : 2}
              opacity={isHovered ? 1 : 0.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: isHovered ? `drop-shadow(0 0 8px ${branch.color})` : 'none',
                transition: 'all 200ms ease',
              }}
              className="cursor-pointer"
              onMouseEnter={() => onLinkHover(linkKey)}
              onMouseLeave={() => onLinkHover(null)}
            />
          );
        });
      });
    });

    return lines;
  }, [adjustedBranches, pointPositions, hoveredLink, hoveredPoint, onLinkHover]);

  // Render points with touch support for mobile
  const renderPoints = useCallback((branch: CareerBranch) => {
    const branchY = branchYPositions[branch.id];

    return branch.points.map(point => {
      const x = 60 + point.x * CELL_WIDTH;
      const y = branchY;
      const radius = getNodeRadius(point.milestone.size);
      const isHovered = hoveredPoint === point.id || clickedPoint === point.id;
      const isHoveredBranch = hoveredBranch === branch.id;

      // Larger touch area for mobile
      const touchRadius = isMobile ? radius + 10 : radius;

      return (
        <g
          key={point.id}
          onMouseEnter={() => {
            if (!isMobile) {
              onPointHover(point.id);
              onBranchHover(branch.id);
            }
          }}
          onMouseLeave={() => {
            if (!isMobile) {
              onPointHover(null);
              onBranchHover(null);
            }
          }}
          onClick={() => {
            if (isMobile) {
              if (clickedPoint === point.id) {
                setClickedPoint(null);
                onPointHover(null);
              } else {
                setClickedPoint(point.id);
                onPointHover(point.id);
                onBranchHover(branch.id);
              }
            }
          }}
          className="cursor-pointer"
        >
          {/* Larger invisible touch target for mobile */}
          {isMobile && (
            <circle
              cx={x}
              cy={y}
              r={touchRadius}
              fill="transparent"
              className="cursor-pointer"
            />
          )}

          {isHovered && (
            <circle
              cx={x}
              cy={y}
              r={radius + 12}
              fill={branch.color}
              opacity="0.2"
              className="animate-pulse"
            />
          )}

          {point.milestone.size === 'large' && (
            <circle
              cx={x}
              cy={y}
              r={radius + 3}
              fill="none"
              stroke={branch.color}
              strokeWidth="2"
              opacity={isHovered || isHoveredBranch ? 1 : 0.6}
              className="transition-opacity"
            />
          )}

          <circle
            cx={x}
            cy={y}
            r={radius}
            fill={branch.color}
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 12px ${branch.color})`
                : `drop-shadow(0 0 4px ${branch.color})`,
            }}
            className="transition-all duration-200"
          />
        </g>
      );
    });
  }, [branchYPositions, hoveredPoint, hoveredBranch, clickedPoint, isMobile, onPointHover, onBranchHover]);

  // Find hovered point data for tooltip
  const hoveredPointData = useMemo(() => {
    if (!hoveredPoint) return null;

    for (const branch of adjustedBranches) {
      const point = branch.points.find(p => p.id === hoveredPoint);
      if (point) {
        const pos = pointPositions[point.id];
        return { point, position: pos, color: branch.color };
      }
    }
    return null;
  }, [hoveredPoint, adjustedBranches, pointPositions]);

  return (
    <div className="overflow-x-auto pb-4 relative">
      {isMobile && clickedPoint && (
        <div className="mb-4 text-center">
          <button
            onClick={() => {
              setClickedPoint(null);
              onPointHover(null);
            }}
            className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            Close Info
          </button>
        </div>
      )}

      <svg width={svgWidth+100} height={svgHeight} className="min-w-full do-not-flip-me">
        {adjustedBranches.map(branch => (
          <g key={`lines-${branch.id}`}>{renderBranchLines(branch)}</g>
        ))}

        <g>{renderConnections()}</g>

        {adjustedBranches.map(branch => (
          <g key={`points-${branch.id}`}>{renderPoints(branch)}</g>
        ))}
      </svg>

      {/* Render tooltip outside SVG */}
      {hoveredPointData && (
        <Tooltip
          point={hoveredPointData.point}
          position={hoveredPointData.position}
          color={hoveredPointData.color}
          isMobile={isMobile}
        />
      )}
    </div>
  );
});

// Legend Component
const TimelineLegend = memo(function TimelineLegend({
  branches,
  t
}: {
  branches: CareerBranch[];
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-6 mt-6 justify-center text-sm text-muted-foreground">
      {branches.map(branch => (
        <div key={branch.id} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: branch.color,
              boxShadow: `0 0 8px ${branch.color}`,
            }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium">{branch.name}</span>
        </div>
      ))}
      <div className="border-l border-border pl-6 flex gap-4 flex-wrap">
        {(['small', 'medium', 'large'] as const).map(size => (
          <div key={size} className="flex items-center gap-2">
            <div
              className="rounded-full bg-muted-foreground"
              style={{
                width: size === 'small' ? '6px' : size === 'medium' ? '8px' : '12px',
                height: size === 'small' ? '6px' : size === 'medium' ? '8px' : '12px',
              }}
              aria-hidden="true"
            />
            <span className="text-xs capitalize">{t(`careerTimeline.${size}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main Timeline Component
const CareerTimeline = memo(function CareerTimeline({
  branches
}: {
  branches: CareerBranch[]
}) {
  const { t } = useLanguage();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [visibleBranches, setVisibleBranches] = useState<Set<string>>(
    () => new Set(branches.map(b => b.id))
  );
  const [sizeFilter, setSizeFilter] = useState<Set<string>>(
    () => new Set(['small', 'medium', 'large'])
  );

  // Assign unique X positions to avoid overlaps
  const assignUniqueXPositions = useCallback((inputBranches: CareerBranch[]) => {
    const usedXPositions = new Set<number>();
    return inputBranches.map(branch => {
      const sortedPoints = [...branch.points].sort((a, b) => a.x - b.x);
      const reassignedPoints = sortedPoints.map(point => {
        let newX = point.x;
        while (usedXPositions.has(newX)) {
          newX++;
        }
        usedXPositions.add(newX);
        return { ...point, x: newX };
      });
      return { ...branch, points: reassignedPoints };
    });
  }, []);

  // Filter branches based on visibility and size
  const adjustedBranches = useMemo(() => {
    return assignUniqueXPositions(branches)
      .filter(branch => visibleBranches.has(branch.id))
      .map(branch => ({
        ...branch,
        points: branch.points.filter(point => sizeFilter.has(point.milestone.size))
      }));
  }, [branches, visibleBranches, sizeFilter, assignUniqueXPositions]);

  // Toggle handlers
  const handleToggleBranch = useCallback((branchId: string) => {
    setVisibleBranches(prev => {
      const next = new Set(prev);
      if (next.has(branchId)) {
        next.delete(branchId);
      } else {
        next.add(branchId);
      }
      return next;
    });
  }, []);

  const handleToggleSize = useCallback((size: string) => {
    setSizeFilter(prev => {
      const next = new Set(prev);
      if (next.has(size)) {
        next.delete(size);
      } else {
        next.add(size);
      }
      return next;
    });
  }, []);

  return (
    <Card className="overflow-hidden " >
      <CardContent className="p-4 sm:p-6">
        <TimelineFilters
          branches={branches}
          visibleBranches={visibleBranches}
          sizeFilter={sizeFilter}
          onToggleBranch={handleToggleBranch}
          onToggleSize={handleToggleSize}
          t={t}
        />
      <div dir="ltr">
        <TimelineVisualization
          adjustedBranches={adjustedBranches}
          hoveredPoint={hoveredPoint}
          hoveredBranch={hoveredBranch}
          hoveredLink={hoveredLink}
          onPointHover={setHoveredPoint}
          onBranchHover={setHoveredBranch}
          onLinkHover={setHoveredLink}
        />

        <TimelineLegend branches={branches} t={t} />
      </div>
      </CardContent>
    </Card>
  );
});

// Section Component (Default Export)
export default function CareerTimelineSection() {
  const { t, getCareerTimelineData } = useLanguage();
  const { branches } = getCareerTimelineData();

  return (
    <section
      id="career-timeline"
      className="w-full scroll-mt-16 px-4 sm:px-0"
      aria-labelledby="career-timeline-heading"
      
    >
      <div className="space-y-6" >
        <div>
          <h2
            id="career-timeline-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tighter"
          >
            {t("careerTimeline.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("careerTimeline.subtitle")}
          </p>
        </div>
        <CareerTimeline branches={branches} />
      </div>
    </section>
  );
}
