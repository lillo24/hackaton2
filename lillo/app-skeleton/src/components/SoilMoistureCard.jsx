import React from 'react';
import SectionCard from './SectionCard';

const fallbackColumns = [
  { id: 'north', label: 'Parcella nord', value: 64 },
  { id: 'lower', label: 'Parcella sud', value: 58 },
  { id: 'target', label: 'Obiettivo', value: 67 },
];

function clampPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function SoilMoistureCard({ columns = fallbackColumns }) {
  const safeColumns = (columns.length ? columns : fallbackColumns).slice(0, 3).map((column, index) => ({
    id: column.id ?? `column-${index + 1}`,
    label: column.label ?? `Parcella ${index + 1}`,
    value: clampPercentage(column.value),
  }));

  return (
    <SectionCard subtitle="Tre colonne di riferimento per un controllo rapido dell'umidita." title="Umidita del suolo">
      <div className="soil-moisture-card">
        <div className="soil-moisture-card__pillars">
          {safeColumns.map((column) => (
            <article className="soil-pillar" key={column.id}>
              <div className="soil-pillar__well" role="img" aria-label={`${column.label} umidita ${column.value}%`}>
                <div className="soil-pillar__fill" style={{ height: `${column.value}%` }} />
              </div>
              <p className="soil-pillar__label">{column.label}</p>
              <p className="soil-pillar__value">{column.value}%</p>
            </article>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export default SoilMoistureCard;
