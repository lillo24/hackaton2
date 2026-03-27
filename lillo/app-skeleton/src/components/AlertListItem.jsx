import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const signalIconPriority = [
  { sourceId: 'satellite-observation', type: 'satellite', label: 'Satellite signals' },
  { sourceId: 'weather-model', type: 'weather', label: 'Weather model signals' },
  { sourceId: 'soil-probe-grid', type: 'soil', label: 'Soil probe signals' },
  { sourceId: 'irrigation-controller', type: 'irrigation', label: 'Irrigation controller signals' },
  { sourceId: 'greenhouse-climate-control', type: 'climate', label: 'Climate controller signals' },
  { sourceId: 'canopy-sensor-network', type: 'sensor', label: 'Canopy sensor signals' },
  { sourceId: 'work-order-history', type: 'operations', label: 'Work-order history signals' },
];

const problemIconByAlertId = {
  'humidity-spike': { type: 'humidity', label: 'Humidity and disease pressure' },
  'irrigation-drift': { type: 'drought', label: 'Drought and irrigation stress' },
  'canopy-stress': { type: 'drought', label: 'Drought and heat stress' },
  'frost-pocket': { type: 'frost', label: 'Frost risk' },
  'ventilation-slip': { type: 'ventilation', label: 'Ventilation control issue' },
  'wind-shift': { type: 'wind', label: 'Wind shift' },
};

function AlertIconGlyph({ type }) {
  if (type === 'satellite') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2.2" />
        <path d="M5 5l4 4M15 15l4 4M15 9l4-4M9 15l-4 4" />
        <path d="M12 7v2M17 12h-2M12 17v-2M7 12h2" />
      </svg>
    );
  }

  if (type === 'weather') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 15h9a3 3 0 0 0 .2-6 4 4 0 0 0-7.5-.8A3 3 0 0 0 7 15z" />
        <path d="M6 18h7M10 20h7" />
      </svg>
    );
  }

  if (type === 'soil') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 15h14" />
        <path d="M8 15v4M12 15v5M16 15v3" />
        <path d="M12 5c2 2.6 2.8 4 2.8 5.3a2.8 2.8 0 1 1-5.6 0C9.2 9 10 7.6 12 5z" />
      </svg>
    );
  }

  if (type === 'irrigation') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 8h8a3 3 0 0 1 0 6h-2" />
        <path d="M11 13.5c1.5 2 1.5 3.1 0 4.5-1.5-1.4-1.5-2.5 0-4.5z" />
      </svg>
    );
  }

  if (type === 'climate' || type === 'ventilation') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 5c2 0 3 1.5 2.3 3L12 12M19 12c0 2-1.5 3-3 2.3L12 12M12 19c-2 0-3-1.5-2.3-3L12 12M5 12c0-2 1.5-3 3-2.3L12 12" />
      </svg>
    );
  }

  if (type === 'sensor') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="14" r="2.2" />
        <path d="M8 10a4.5 4.5 0 0 1 8 0" />
        <path d="M6 8a7 7 0 0 1 12 0" />
      </svg>
    );
  }

  if (type === 'operations') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="13" rx="2" width="10" x="7" y="6" />
        <path d="M10 6V5h4v1" />
        <path d="M9.5 11h5M9.5 14h5" />
      </svg>
    );
  }

  if (type === 'drought') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M11 19v-6" />
        <path d="M11 13c2.7.4 4.4-.5 5.3-2.7-2.2-.9-4-.4-5.3 2.7z" />
        <path d="M11 13c-2.2.3-3.8-.3-4.9-2.1 2-.9 3.5-.6 4.9 2.1z" />
        <path d="M11 15c-1 1.3-2.1 2-3.6 2.2" />
      </svg>
    );
  }

  if (type === 'humidity') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 4c3 3.7 4.2 5.6 4.2 7.7A4.2 4.2 0 1 1 7.8 11.7C7.8 9.6 9 7.7 12 4z" />
      </svg>
    );
  }

  if (type === 'frost') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 4v16M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11" />
      </svg>
    );
  }

  if (type === 'wind') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 9h10a2 2 0 1 0-2-2" />
        <path d="M4 13h14a2 2 0 1 1-2 2" />
        <path d="M4 17h8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5l7 13H5z" />
      <path d="M12 10v4M12 16h.01" />
    </svg>
  );
}

function AlertIcon({ label, type }) {
  return (
    <span aria-label={label} className={`alert-list-item__icon alert-list-item__icon--${type}`} role="img" title={label}>
      <AlertIconGlyph type={type} />
    </span>
  );
}

function pickSignalIcon(sourceIds = [], sourceNames = []) {
  const selected = signalIconPriority.find((entry) => sourceIds.includes(entry.sourceId));
  const namesLabel = sourceNames.length > 0 ? sourceNames.join(', ') : 'Source unavailable';

  if (!selected) {
    return {
      type: 'sensor',
      label: `Signal source: ${namesLabel}`,
    };
  }

  return {
    type: selected.type,
    label: `${selected.label}: ${namesLabel}`,
  };
}

function pickProblemIcon(alert) {
  if (problemIconByAlertId[alert.id]) {
    return problemIconByAlertId[alert.id];
  }

  const searchableText = `${alert.title} ${alert.summary}`.toLowerCase();

  if (searchableText.includes('dry') || searchableText.includes('moisture') || searchableText.includes('water')) {
    return { type: 'drought', label: 'Drought and water stress' };
  }

  if (searchableText.includes('frost') || searchableText.includes('cold')) {
    return { type: 'frost', label: 'Frost risk' };
  }

  if (searchableText.includes('humidity') || searchableText.includes('wetness') || searchableText.includes('mildew')) {
    return { type: 'humidity', label: 'Humidity and disease pressure' };
  }

  if (searchableText.includes('wind')) {
    return { type: 'wind', label: 'Wind shift' };
  }

  return { type: 'general', label: 'General alert issue' };
}

function formatChipLabel(value) {
  const labels = {
    critical: 'Critica',
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa',
  };

  return labels[value] ?? value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function AlertListItem({
  alert,
  index = 0,
  isHistorical = false,
  isFocused = false,
  returnTo = '/alerts',
  linkSearch = '',
  onOpenAlert,
}) {
  const className = `alert-list-item alert-list-item--${alert.severity}${isFocused ? ' is-focused' : ''}${
    isHistorical ? ' is-historical' : ''
  }`;
  const signalIcon = pickSignalIcon(alert.sourceIds, alert.sourceNames);
  const problemIcon = pickProblemIcon(alert);
  const cardContent = (
    <div className="alert-list-item__layout">
      <div className="alert-list-item__main">
        <div className="alert-list-item__row">
          <div className="alert-list-item__chips">
            <StatusBadge tone={alert.severity}>{formatChipLabel(alert.severity)}</StatusBadge>
            {alert.status === 'new' ? (
              <span aria-label="New alert" className="alert-list-item__new-dot" role="img" title="New alert" />
            ) : null}
          </div>
          <span className="alert-list-item__timestamp">{alert.timestampLabel}</span>
        </div>
        <h3 className="alert-list-item__title">{alert.title}</h3>
        <p className="alert-list-item__description">{alert.summary}</p>
      </div>
      <div className="alert-list-item__side">
        <div className="alert-list-item__icons alert-list-item__icons--large" role="presentation">
          <AlertIcon label={signalIcon.label} type={signalIcon.type} />
          <AlertIcon label={`Problem type: ${problemIcon.label}`} type={problemIcon.type} />
        </div>
      </div>
    </div>
  );

  if (isHistorical) {
    return (
      <article aria-label={`Historical alert: ${alert.title}`} className={className} style={{ '--delay': `${index * 60}ms` }}>
        {cardContent}
      </article>
    );
  }

  return (
    <Link
      aria-label={`Open alert details: ${alert.title}`}
      className={className}
      onClick={() => onOpenAlert?.(alert.id)}
      state={{ focusAlertId: alert.id, from: returnTo }}
      to={{ pathname: `/alerts/${alert.id}`, search: linkSearch }}
      style={{ '--delay': `${index * 60}ms` }}
    >
      {cardContent}
    </Link>
  );
}

export default AlertListItem;
