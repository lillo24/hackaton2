import React, { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AlertListItem from '../components/AlertListItem';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';
import { alertSeverityScale } from '../data/mockData';

const severityPriority = { critical: 4, high: 3, medium: 2, low: 1 };
const statusPriority = { new: 5, active: 4, monitoring: 3, acknowledged: 2, resolved: 1 };
const relevancePriority = { primary: 3, supporting: 2, background: 1 };

function formatOptionLabel(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readFilter(searchParams, filterName, allowedValues) {
  const rawValue = searchParams.get(filterName);

  if (!rawValue) {
    return 'all';
  }

  return allowedValues.includes(rawValue) ? rawValue : 'all';
}

function recencyPriority(minutesAgo) {
  if (minutesAgo <= 10) {
    return 4;
  }

  if (minutesAgo <= 30) {
    return 3;
  }

  if (minutesAgo <= 90) {
    return 2;
  }

  return 1;
}

function scoreAlertPriority(alert) {
  const severityScore = severityPriority[alert.severity] ?? 0;
  const statusScore = statusPriority[alert.status] ?? 0;
  const relevanceScore = relevancePriority[alert.farmRelevance] ?? 0;
  const recencyScore = recencyPriority(alert.timestampMinutesAgo);

  // Weighted so critical/high and farm-relevant alerts lead, while recency and status still influence ties.
  return severityScore * 50 + relevanceScore * 30 + statusScore * 15 + recencyScore * 5;
}

function rankAlerts(alerts) {
  return alerts
    .slice()
    .sort((left, right) => {
      const scoreDelta = scoreAlertPriority(right) - scoreAlertPriority(left);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      if (left.timestampMinutesAgo !== right.timestampMinutesAgo) {
        return left.timestampMinutesAgo - right.timestampMinutesAgo;
      }

      return left.title.localeCompare(right.title);
    });
}

function classifyAlert(alert) {
  if (alert.status === 'resolved') {
    return 'resolved';
  }

  if (alert.severity === 'critical' || alert.severity === 'high' || alert.status === 'new' || alert.status === 'active') {
    return 'actionNow';
  }

  return 'monitor';
}

function AlertsLoadingState() {
  return (
    <div className="alert-list">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton-card" key={`alert-loading-${index}`} />
      ))}
    </div>
  );
}

function AlertsPage({
  alerts,
  isLoading = false,
  selectedAlertId = null,
  onSelectAlert,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const focusedAlertId = location.state?.focusAlertId ?? selectedAlertId;
  const rankedAlerts = useMemo(() => rankAlerts(alerts), [alerts]);
  const sourceOptions = useMemo(() => {
    const sourceMap = new Map();

    rankedAlerts.forEach((alert) => {
      alert.sources.forEach((source) => {
        sourceMap.set(source.id, source.label);
      });
    });

    return Array.from(sourceMap.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [rankedAlerts]);
  const historyAlerts = useMemo(
    () => [
      {
        id: 'history-irrigation-drift-archived',
        severity: 'low',
        status: 'resolved',
        title: 'Irrigation drift stabilized after valve calibration',
        summary: 'Archived signal from the previous cycle. Moisture variance recovered inside the expected range.',
        sourceIds: ['soil-probe-grid', 'weather-model'],
        sourceNames: ['Soil Probe Grid', 'Weather Forecast Fusion'],
        timestampLabel: '3 days ago',
        isHistorical: true,
      },
    ],
    [],
  );

  const severityFilter = readFilter(searchParams, 'severity', alertSeverityScale);
  const sourceFilter = readFilter(searchParams, 'source', sourceOptions.map((source) => source.id));
  const historyEnabled = searchParams.get('history') === '1';
  const filteredAlerts = useMemo(
    () => {
      const baseAlerts = rankedAlerts.filter((alert) => {
        if (severityFilter !== 'all' && alert.severity !== severityFilter) {
          return false;
        }

        if (sourceFilter !== 'all' && !alert.sourceIds.includes(sourceFilter)) {
          return false;
        }

        return true;
      });

      if (!historyEnabled) {
        return baseAlerts;
      }

      const visibleHistoryAlerts = historyAlerts.filter((alert) => {
        if (severityFilter !== 'all' && alert.severity !== severityFilter) {
          return false;
        }

        if (sourceFilter !== 'all' && !alert.sourceIds.includes(sourceFilter)) {
          return false;
        }

        return true;
      });

      return [...baseAlerts, ...visibleHistoryAlerts];
    },
    [historyAlerts, historyEnabled, rankedAlerts, severityFilter, sourceFilter],
  );
  const groupedAlerts = useMemo(() => {
    const nextGroups = {
      actionNow: [],
      monitor: [],
      resolved: [],
    };

    filteredAlerts.forEach((alert) => {
      nextGroups[classifyAlert(alert)].push(alert);
    });

    return nextGroups;
  }, [filteredAlerts]);

  const returnTo = `${location.pathname}${location.search}`;

  function updateFilter(filterName, nextValue) {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.delete('status');
    nextSearch.delete('relevance');

    if (nextValue === 'all') {
      nextSearch.delete(filterName);
    } else {
      nextSearch.set(filterName, nextValue);
    }

    setSearchParams(nextSearch, { replace: true });
  }

  function toggleHistory() {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.delete('status');
    nextSearch.delete('relevance');

    if (historyEnabled) {
      nextSearch.delete('history');
    } else {
      nextSearch.set('history', '1');
    }

    setSearchParams(nextSearch, { replace: true });
  }

  function handleOpenAlert(alertId) {
    onSelectAlert?.(alertId);
  }

  function renderAlertGroup({
    title,
    subtitle,
    alertsInGroup,
    startIndex,
    showHeader = true,
  }) {
    if (alertsInGroup.length === 0) {
      return null;
    }

    return (
      <section className={`alert-group${showHeader ? '' : ' alert-group--unstyled'}`} key={title}>
        {showHeader ? (
          <header className="alert-group__header">
            <div>
              <h2 className="alert-group__title">{title}</h2>
              <p className="alert-group__subtitle">{subtitle}</p>
            </div>
            <StatusBadge tone="neutral">{alertsInGroup.length}</StatusBadge>
          </header>
        ) : null}
        <div className="alert-list">
          {alertsInGroup.map((alert, index) => (
            <AlertListItem
              alert={alert}
              index={startIndex + index}
              isHistorical={Boolean(alert.isHistorical)}
              isFocused={focusedAlertId === alert.id}
              key={alert.id}
              returnTo={returnTo}
              onOpenAlert={handleOpenAlert}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="page alerts-page">
      <section aria-label="Alert filters" className="alerts-filter-panel">
        <div className="filter-grid filter-grid--alerts">
          <label className="filter-field" htmlFor="severity-filter">
            Severity
            <select
              className="filter-control"
              id="severity-filter"
              onChange={(event) => updateFilter('severity', event.target.value)}
              value={severityFilter}
            >
              <option value="all">All</option>
              {alertSeverityScale.map((severity) => (
                <option key={severity} value={severity}>
                  {formatOptionLabel(severity)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field" htmlFor="source-filter">
            Source
            <select
              className="filter-control"
              id="source-filter"
              onChange={(event) => updateFilter('source', event.target.value)}
              value={sourceFilter}
            >
              <option value="all">All</option>
              {sourceOptions.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-field filter-field--toggle">
            <span>History</span>
            <button
              aria-pressed={historyEnabled}
              className={`filter-toggle${historyEnabled ? ' is-active' : ''}`}
              onClick={toggleHistory}
              type="button"
            >
              History
            </button>
          </div>
        </div>

      </section>

      {isLoading ? <AlertsLoadingState /> : null}

      {!isLoading && alerts.length === 0 ? (
        <SectionCard subtitle="This profile currently has no mock signals wired into the shared model." title="No alerts configured">
          <p className="detail-text">No alerts are available for the current profile context.</p>
        </SectionCard>
      ) : null}

      {!isLoading && alerts.length > 0 && filteredAlerts.length === 0 ? (
        <SectionCard subtitle="No alerts match the current filter selection." title="No results for filters">
          <p className="detail-text">Try widening severity, source, or relevance to recover the full operational feed.</p>
        </SectionCard>
      ) : null}

      {!isLoading && filteredAlerts.length > 0 ? (
        <div className="alert-groups">
          {renderAlertGroup({
            title: 'Needs action now',
            subtitle: 'Critical and active signals that should drive the immediate response queue.',
            alertsInGroup: groupedAlerts.actionNow,
            startIndex: 0,
            showHeader: false,
          })}
          {renderAlertGroup({
            title: 'Monitor',
            subtitle: 'Signals that are stable enough for watch-mode and scheduled checks.',
            alertsInGroup: groupedAlerts.monitor,
            startIndex: groupedAlerts.actionNow.length,
            showHeader: false,
          })}
          {renderAlertGroup({
            title: 'Recently resolved',
            subtitle: 'Closed signals kept visible for context and post-action confirmation.',
            alertsInGroup: groupedAlerts.resolved,
            startIndex: groupedAlerts.actionNow.length + groupedAlerts.monitor.length,
          })}
        </div>
      ) : null}
    </div>
  );
}

export default AlertsPage;
