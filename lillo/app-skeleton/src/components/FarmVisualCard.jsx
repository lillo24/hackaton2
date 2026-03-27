import React from 'react';
import SectionCard from './SectionCard';

const markerPalette = ['#3f6e4e', '#77985f', '#5c7f64'];
const defaultMarkers = ['North canopy', 'Lower terrace', 'Irrigation hub'];
const tileDefinitions = [
  {
    id: 'tile-1',
    type: 'verified',
    gradientId: 'farm-tile-1',
    clipPathId: 'farm-tile-clip-1',
    points: '160,38 215,66 160,95 105,66',
    x: 160,
    y: 61,
  },
  {
    id: 'tile-2',
    type: 'warning',
    gradientId: 'farm-tile-2',
    clipPathId: 'farm-tile-clip-2',
    points: '215,66 270,95 215,124 160,95',
    x: 215,
    y: 89,
  },
  {
    id: 'tile-3',
    type: 'verified',
    gradientId: 'farm-tile-3',
    clipPathId: 'farm-tile-clip-3',
    points: '160,95 215,124 160,152 105,124',
    x: 160,
    y: 117,
  },
  {
    id: 'tile-4',
    type: 'warning',
    gradientId: 'farm-tile-4',
    clipPathId: 'farm-tile-clip-4',
    points: '105,66 160,95 105,124 50,95',
    x: 105,
    y: 89,
  },
];

const frozenSnowflakes = [
  { x: -20, y: -12, driftX: 4, drop: 18, delay: '0s', duration: '3.4s' },
  { x: -8, y: -9, driftX: 2, drop: 16, delay: '0.8s', duration: '3s' },
  { x: 6, y: -13, driftX: -3, drop: 19, delay: '1.4s', duration: '3.7s' },
  { x: 18, y: -7, driftX: -2, drop: 15, delay: '0.5s', duration: '2.9s' },
  { x: -2, y: 0, driftX: 3, drop: 14, delay: '1.9s', duration: '3.2s' },
  { x: 14, y: 3, driftX: -4, drop: 17, delay: '1.1s', duration: '3.6s' },
];

function renderTerrainPatternDefs() {
  return (
    <>
      <linearGradient id="farm-terrain-toplight" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#fff9ec" stopOpacity="0.32" />
        <stop offset="45%" stopColor="#fff9ec" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#4f3920" stopOpacity="0.14" />
      </linearGradient>

      <pattern id="farm-fungus-pattern-relief" height="18" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse" width="18">
        <path d="M 0.8 8.2 L 7 4.5 L 13.2 8.2 L 7 11.9 Z" fill="#6a4a29" fillOpacity="0.12" />
        <path d="M 1.4 7.2 L 7 4 L 12.6 7.2 L 7 10.4 Z" fill="#c0a06b" fillOpacity="0.48" />
        <path d="M 2.7 6.5 L 7 4.2 L 10.6 6.2 L 7 7.7 Z" fill="#fff2cc" fillOpacity="0.34" />
        <path d="M 9.8 17.2 L 16 13.5 L 22.2 17.2 L 16 20.9 Z" fill="#6a4a29" fillOpacity="0.1" />
        <path d="M 10.4 16.2 L 16 13 L 21.6 16.2 L 16 19.4 Z" fill="#b48a55" fillOpacity="0.28" />
      </pattern>

      <pattern id="farm-frozen-pattern-frost" height="18" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse" width="18">
        <path d="M 0.8 8.3 L 7 4.6 L 13.2 8.3 L 7 12 Z" fill="#5a7ea3" fillOpacity="0.16" />
        <path d="M 1.5 7.3 L 7 4.2 L 12.5 7.3 L 7 10.4 Z" fill="#d7efff" fillOpacity="0.62" />
        <path d="M 3.1 6.4 L 7 4.6 L 10.2 6.2 L 7 7.7 Z" fill="#ffffff" fillOpacity="0.52" />
        <path d="M 7 4.3 V 10.4" stroke="#8fbfdd" strokeOpacity="0.42" strokeWidth="0.76" />
        <path d="M 1.7 7.3 H 12.3" stroke="#7fb0d4" strokeOpacity="0.3" strokeWidth="0.72" />
        <path d="M 9.8 17.2 L 16 13.5 L 22.2 17.2 L 16 20.9 Z" fill="#587da0" fillOpacity="0.12" />
      </pattern>

      <pattern id="farm-frozen-pattern-crystals" height="18" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse" width="18">
        <path d="M 2 8.2 L 7.1 3.9 L 12.2 8.2 L 7.1 12.6 Z" fill="#5e84ab" fillOpacity="0.14" />
        <path d="M 2.7 8.1 L 7.1 4.6 L 11.5 8.1 L 7.1 11.8 Z" fill="#dff4ff" fillOpacity="0.58" />
        <path d="M 7.1 4.7 L 7.1 11.7" stroke="#85b7dd" strokeOpacity="0.5" strokeWidth="0.74" />
        <path d="M 3.4 8.2 H 10.8" stroke="#93c3e6" strokeOpacity="0.34" strokeWidth="0.7" />
        <path d="M 4.4 5.7 L 9.8 10.7" stroke="#ffffff" strokeOpacity="0.34" strokeWidth="0.62" />
        <path d="M 4.4 10.7 L 9.8 5.7" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="0.62" />
      </pattern>

      <pattern id="farm-frozen-pattern-plates" height="18" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse" width="20">
        <path d="M 1.4 6.5 H 9.7 L 12.9 9.2 H 4.8 Z" fill="#5f85aa" fillOpacity="0.14" />
        <path d="M 2 5.8 H 9 L 11.3 7.8 H 4.4 Z" fill="#dcefff" fillOpacity="0.6" />
        <path d="M 3.1 6.4 H 8 L 9.4 7.5 H 4.6 Z" fill="#ffffff" fillOpacity="0.34" />
        <path d="M 9.8 13.2 H 18.3 L 21.2 15.7 H 12.9 Z" fill="#5b82a7" fillOpacity="0.12" />
        <path d="M 10.6 12.5 H 17.1 L 19.2 14.2 H 12.7 Z" fill="#cce7fb" fillOpacity="0.42" />
      </pattern>
    </>
  );
}

function renderFrozenSnowfall(tile, treatment) {
  if (treatment.problem !== 'frozen') {
    return null;
  }

  const snowfallClassName = [
    'farm-visual-card__snowfall',
    treatment.tone === 'problem' ? 'is-problem' : 'is-preview',
  ].join(' ');

  return (
    <g className={snowfallClassName} clipPath={`url(#${tile.clipPathId})`} key={`${tile.id}-snow`}>
      <g transform={`translate(${tile.x} ${tile.y})`}>
        {frozenSnowflakes.map((flake, index) => (
          <g key={`${tile.id}-snowflake-${index}`} transform={`translate(${flake.x} ${flake.y})`}>
            <g
              className={`farm-visual-card__snowflake farm-visual-card__snowflake--${(index % 3) + 1}`}
              style={{
                '--snow-drift-x': `${flake.driftX}px`,
                '--snow-drop': `${flake.drop}px`,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
              }}
            >
              <path d="M -1.9 0 H 1.9 M 0 -1.9 V 1.9 M -1.35 -1.35 L 1.35 1.35 M -1.35 1.35 L 1.35 -1.35" />
            </g>
          </g>
        ))}
      </g>
    </g>
  );
}

function renderTerrainTreatment(tile, treatment) {
  const problem = treatment.problem ?? 'fungus';
  const variant = treatment.variant ?? (problem === 'frozen' ? 'frost' : 'relief');
  const patternId =
    problem === 'frozen' && variant === 'frost'
      ? 'farm-frozen-pattern-frost'
      : problem === 'frozen' && variant === 'crystals'
        ? 'farm-frozen-pattern-crystals'
        : problem === 'frozen' && variant === 'plates'
          ? 'farm-frozen-pattern-plates'
      : problem === 'fungus' && variant === 'relief'
        ? 'farm-fungus-pattern-relief'
        : null;

  if (!patternId) {
    return null;
  }

  const toneClassName = treatment.tone === 'problem' ? 'is-problem' : 'is-preview';
  const treatmentClassName = [
    'farm-visual-card__terrain-treatment',
    `farm-visual-card__terrain-treatment--${problem}`,
    `farm-visual-card__terrain-treatment--${variant}`,
    toneClassName,
  ].join(' ');

  return (
    <g className={treatmentClassName} clipPath={`url(#${tile.clipPathId})`} key={`${tile.id}-${treatment.variant}`}>
      <polygon className="farm-visual-card__terrain-base" points={tile.points} />
      <rect className="farm-visual-card__terrain-pattern-layer" fill={`url(#${patternId})`} height="140" width="250" x="34" y="24" />
      <polygon className="farm-visual-card__terrain-toplight" fill="url(#farm-terrain-toplight)" points={tile.points} />
    </g>
  );
}

function FarmVisualCard({
  farmName = 'Farm context',
  markers = defaultMarkers,
  contextPills = [],
  floatingSummaryItems = [],
  onOpenTileAlert,
  signalBadges = [],
  showLegend = true,
  subtitle = 'Stylized parcel view for orientation only.',
  tileAlertAssignments = [],
  tileTerrainTreatments = [],
  title = 'Farm visual context',
  sectionClassName = '',
}) {
  const visibleMarkers = (markers.length ? markers : defaultMarkers).slice(0, 3);
  const visiblePills = contextPills.slice(0, 4);
  const tileAlertAssignmentsById = new Map(tileAlertAssignments.map((assignment) => [assignment.tileId, assignment]));
  const tileTerrainTreatmentsById = new Map(tileTerrainTreatments.map((treatment) => [treatment.tileId, treatment]));

  return (
    <SectionCard className={sectionClassName} subtitle={subtitle} title={title}>
      <div className="farm-visual-card">
        <div className="farm-visual-card__stage">
          {signalBadges.length ? (
            <ul aria-label="Sorgenti" className="farm-visual-card__signals">
              {signalBadges.map((signal) => (
                <li
                  className={`farm-visual-card__signal-item ${signal.connected ? 'is-connected' : 'is-broken'}`}
                  key={signal.id}
                  title={`${signal.label}: ${signal.connected ? 'connesso' : 'non disponibile'}`}
                >
                  <span className="farm-visual-card__signal-icon">{signal.icon}</span>
                  <span className="farm-visual-card__signal-copy">
                    <strong>{signal.label}</strong>
                    <small>{signal.statusLabel ?? (signal.connected ? 'Attivo' : 'Non attivo')}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {floatingSummaryItems.length ? (
            <ul aria-label="Riepilogo segnalazioni" className="farm-visual-card__summary">
              {floatingSummaryItems.map((item) => (
                <li className={`farm-visual-card__summary-pill farm-visual-card__summary-pill--${item.tone}`} key={item.key}>
                  <span aria-hidden="true" className="farm-visual-card__summary-dot" />
                  {item.label}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="farm-visual-card__scene-shell">
            <svg
              aria-label={`${farmName} illustrazione statica delle parcelle`}
              className="farm-visual-card__scene"
              role="img"
              viewBox="0 0 320 190"
            >
              <defs>
                <linearGradient id="farm-tile-1" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#dce9c9" />
                  <stop offset="100%" stopColor="#9dbd84" />
                </linearGradient>
                <linearGradient id="farm-tile-2" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4e3be" />
                  <stop offset="100%" stopColor="#91b575" />
                </linearGradient>
                <linearGradient id="farm-tile-3" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#c8dcae" />
                  <stop offset="100%" stopColor="#7ea466" />
                </linearGradient>
                <linearGradient id="farm-tile-4" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#d0e2ba" />
                  <stop offset="100%" stopColor="#8bb271" />
                </linearGradient>

                {tileDefinitions.map((tile) => (
                  <clipPath id={tile.clipPathId} key={tile.clipPathId}>
                    <polygon points={tile.points} />
                  </clipPath>
                ))}
                {renderTerrainPatternDefs()}
              </defs>

              <polygon fill="#6c5135" points="50,95 160,152 160,184 50,127" />
              <polygon fill="#7a5c3d" points="160,152 270,95 270,127 160,184" />
              <polygon
                fill="none"
                points="160,38 270,95 160,152 50,95"
                stroke="#5f7b4d"
                strokeLinejoin="round"
                strokeWidth="2"
              />

              <g stroke="#6d8f5e" strokeLinejoin="round" strokeWidth="1.6">
                {tileDefinitions.map((tile) => (
                  <polygon fill={`url(#${tile.gradientId})`} key={tile.id} points={tile.points} />
                ))}
              </g>

              <g aria-hidden="true">
                {tileDefinitions.map((tile) => {
                  const treatment = tileTerrainTreatmentsById.get(tile.id);

                  if (!treatment?.problem || !treatment.variant) {
                    return null;
                  }

                  return (
                    <React.Fragment key={`${tile.id}-${treatment.problem}-${treatment.variant}`}>
                      {renderTerrainTreatment(tile, treatment)}
                      {renderFrozenSnowfall(tile, treatment)}
                    </React.Fragment>
                  );
                })}
              </g>

              <g aria-hidden="true">
                {tileDefinitions.map((status, index) => (
                  <g
                    className={`farm-visual-card__tile-status farm-visual-card__tile-status--${status.type} farm-visual-card__tile-status--float-${index + 1}`}
                    key={status.id}
                  >
                    <circle className="farm-visual-card__tile-status-core" cx={status.x} cy={status.y} r="9.6" />
                    {status.type === 'verified' ? (
                      <path d={`M ${status.x - 3.8} ${status.y + 0.1} L ${status.x - 1} ${status.y + 3.1} L ${status.x + 4.2} ${status.y - 2.4}`} />
                    ) : (
                      <g className="farm-visual-card__tile-status-warning-glyph">
                        <path className="farm-visual-card__tile-status-warning-mark" d={`M ${status.x - 5} ${status.y + 4.7} H ${status.x + 5} L ${status.x} ${status.y - 4.9} Z`} />
                        <rect className="farm-visual-card__tile-status-warning-bar" height="4.2" rx="0.72" width="1.44" x={status.x - 0.72} y={status.y - 2.15} />
                        <circle className="farm-visual-card__tile-status-warning-dot" cx={status.x} cy={status.y + 2.85} r="0.72" />
                      </g>
                    )}
                  </g>
                ))}
              </g>
            </svg>

            <ul className="farm-visual-card__tile-hit-areas">
              {tileDefinitions.map((status) => {
                const assignment = tileAlertAssignmentsById.get(status.id);

                if (status.type !== 'warning' || !assignment?.alertId || typeof onOpenTileAlert !== 'function') {
                  return null;
                }

                return (
                  <li
                    className="farm-visual-card__tile-hit-area-item"
                    key={status.id}
                    style={{
                      '--tile-hit-area-left': `${(status.x / 320) * 100}%`,
                      '--tile-hit-area-top': `${(status.y / 190) * 100}%`,
                    }}
                  >
                    <button
                      aria-label={assignment.buttonLabel}
                      className="farm-visual-card__tile-hit-area"
                      onClick={() => onOpenTileAlert(assignment.alertId)}
                      title={assignment.buttonLabel}
                      type="button"
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {visiblePills.map((pill, index) => (
            <article className={`farm-visual-card__pill farm-visual-card__pill--${index + 1}`} key={`${pill.label}-${pill.value}`}>
              <span>{pill.label}</span>
              <strong>{pill.value}</strong>
            </article>
          ))}
        </div>

        {showLegend ? (
          <ul className="farm-visual-card__legend">
            {visibleMarkers.map((marker, index) => (
              <li key={`${marker}-${index}`}>
                <span style={{ backgroundColor: markerPalette[index % markerPalette.length] }} />
                {marker}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default FarmVisualCard;
