import React, { useMemo } from 'react';
import SectionCard from './SectionCard';

const fallbackPoints = [
  { label: 'Lun', value: 51 },
  { label: 'Mar', value: 48 },
  { label: 'Mer', value: 52 },
  { label: 'Gio', value: 56 },
  { label: 'Ven', value: 61 },
  { label: 'Sab', value: 58 },
  { label: 'Dom', value: 60 },
];

function clampPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function buildCoordinates(points, width, height, paddingX, paddingY) {
  const sanitizedValues = points.map((point) => clampPercentage(point.value));
  const maxValue = Math.max(...sanitizedValues);
  const minValue = Math.min(...sanitizedValues);
  const valueRange = Math.max(1, maxValue - minValue);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  return points.map((point, index) => {
    const value = clampPercentage(point.value);
    const x = paddingX + (usableWidth * index) / (points.length - 1);
    const y = height - paddingY - ((value - minValue) / valueRange) * usableHeight;

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    };
  });
}

function buildSmoothPath(points) {
  if (!points.length) {
    return '';
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const currentPoint = points[index];
    const nextPoint = points[index + 1];
    const controlX = Number(((currentPoint.x + nextPoint.x) / 2).toFixed(2));

    path += ` C ${controlX} ${currentPoint.y}, ${controlX} ${nextPoint.y}, ${nextPoint.x} ${nextPoint.y}`;
  }

  return path;
}

function WaterLevelCard({ points = fallbackPoints }) {
  const chartWidth = 296;
  const chartHeight = 126;
  const chartPaddingX = 10;
  const chartPaddingY = 14;
  const baselineY = chartHeight - chartPaddingY;
  const safePoints = points.length >= 2 ? points : fallbackPoints;

  const chartPoints = useMemo(
    () => buildCoordinates(safePoints, chartWidth, chartHeight, chartPaddingX, chartPaddingY),
    [safePoints],
  );
  const linePath = useMemo(() => buildSmoothPath(chartPoints), [chartPoints]);
  const areaPath = useMemo(() => {
    if (!linePath) {
      return '';
    }

    return `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${baselineY} L ${chartPoints[0].x} ${baselineY} Z`;
  }, [baselineY, chartPoints, linePath]);

  const latestPoint = safePoints[safePoints.length - 1];

  return (
    <SectionCard subtitle="Ultimi sette giorni del profilo irriguo attivo." title="Andamento livello acqua">
      <div className="water-level-card">
        <div className="water-level-card__summary">
          <strong className="water-level-card__value">{clampPercentage(latestPoint.value)}%</strong>
          <span className="water-level-card__label">Livello attuale</span>
        </div>

        <div className="water-level-card__chart">
          <svg aria-hidden="true" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {areaPath ? <path className="water-level-card__area" d={areaPath} /> : null}
            {linePath ? <path className="water-level-card__line" d={linePath} /> : null}
            {chartPoints.length ? (
              <circle
                className="water-level-card__focus"
                cx={chartPoints[chartPoints.length - 1].x}
                cy={chartPoints[chartPoints.length - 1].y}
                r="4.4"
              />
            ) : null}
          </svg>
        </div>

        <div className="water-level-card__axis">
          {safePoints.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export default WaterLevelCard;
