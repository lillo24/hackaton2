import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlertDetailBlock from '../components/AlertDetailBlock';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';
import { adminCustomers } from '../data/adminMockData';
import { useAdminDocumentScroll } from './adminAccess';

const ACTIVE_ALERT_STATUSES = new Set(['new', 'active', 'open', 'ongoing', 'monitoring', 'in-progress', 'in_progress']);
const RESOLVED_ALERT_STATUSES = new Set(['resolved', 'closed', 'dismissed', 'completed']);

function formatAlertTime(alert) {
  if (typeof alert.occurredMinutesAgo === 'number') {
    return `${alert.occurredMinutesAgo} min fa`;
  }

  if (typeof alert.occurredHoursAgo === 'number') {
    return `${alert.occurredHoursAgo} h fa`;
  }

  if (alert.timestampLabel) {
    return alert.timestampLabel;
  }

  return 'Recente';
}

function formatSeverityLabel(value) {
  const labels = {
    critical: 'Critico',
    high: 'Alto',
    medium: 'Medio',
    low: 'Basso',
  };

  return labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

function buildFallbackSources(alert) {
  const signal = alert.sourceSummary ?? alert.summary ?? 'Sono disponibili segnali integrati per questo evento.';
  const label = alert.sourceLabel ?? alert.sourceSummary ?? 'Segnali integrati';

  return [
    {
      id: `${alert.id}-source-fallback`,
      label,
      signal,
    },
  ];
}

function normalizeAdminAlert(alert) {
  const normalizedSources =
    Array.isArray(alert.sources) && alert.sources.length > 0
      ? alert.sources.map((source, index) => ({
          id: source.id ?? `${alert.id}-source-${index}`,
          label: source.label ?? source.name ?? source.source ?? 'Segnale integrato',
          signal:
            source.signal ??
            source.summary ??
            source.value ??
            alert.sourceSummary ??
            alert.summary ??
            'Dettaglio del segnale non disponibile.',
        }))
      : buildFallbackSources(alert);

  return {
    id: alert.id,
    severity: alert.severity,
    timestampLabel: formatAlertTime(alert),
    title: alert.title ?? 'Allerta senza titolo',
    summary: alert.summary ?? alert.sourceSummary ?? 'Nessun riepilogo disponibile per questa allerta.',
    field: {
      name: alert.field?.name ?? alert.fieldName ?? 'Appezzamento sconosciuto',
    },
    status: alert.status,
    sources: normalizedSources,
    integratedSummary:
      alert.integratedSummary ??
      alert.whyTriggered ??
      alert.summary ??
      alert.sourceSummary ??
      'Spiegazione integrata non disponibile.',
    riskLine: typeof alert.riskScore === 'number' ? `Rischio ${formatSeverityLabel(alert.severity).toLowerCase()} ${alert.riskScore}%` : null,
  };
}

function getAlertStatusBucket(status) {
  const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : '';

  if (RESOLVED_ALERT_STATUSES.has(normalizedStatus)) {
    return 'resolved';
  }

  if (ACTIVE_ALERT_STATUSES.has(normalizedStatus) || normalizedStatus.length === 0) {
    return 'active';
  }

  return 'active';
}

function AdminCustomerAlert({ alert }) {
  const [isOpen, setIsOpen] = useState(false);
  const summaryRegionId = `${alert.id}-admin-alert-content`;

  return (
    <article
      className={`admin-customer-alert-card${isOpen ? ' admin-customer-alert-card--open' : ''} alert-detail-page--${alert.severity}`}
    >
      <button
        aria-controls={summaryRegionId}
        aria-expanded={isOpen}
        className="admin-customer-alert-card__header"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        <div className="admin-customer-alert-card__header-main">
          <StatusBadge tone={alert.severity}>{formatSeverityLabel(alert.severity)}</StatusBadge>
          <h2 className="admin-customer-alert-card__title">{alert.title}</h2>
        </div>
        <span aria-hidden="true" className={`admin-customer-alert-card__chevron${isOpen ? ' is-open' : ''}`} />
      </button>

      {isOpen ? (
        <div className="admin-customer-alert-card__body" id={summaryRegionId}>
          <AlertDetailBlock
            alert={alert}
            className="admin-customer-alert"
            headingLevel="h3"
            integratedCollapsible={false}
            integratedInitiallyOpen={true}
            integratedPanelId={`${alert.id}-integrated-content`}
            showAction={false}
            showField={false}
            showHeader={false}
            showSummary={false}
          />
        </div>
      ) : null}
    </article>
  );
}

function AdminCustomerPage() {
  useAdminDocumentScroll();
  const { customerId } = useParams();
  const [alertFilter, setAlertFilter] = useState('active');

  const customer = useMemo(
    () => adminCustomers.find((candidate) => candidate.id === customerId) ?? null,
    [customerId],
  );
  const customerAlerts = customer?.alerts ?? [];
  const normalizedAlerts = useMemo(
    () => customerAlerts.map(normalizeAdminAlert),
    [customerAlerts],
  );
  const activeAlerts = useMemo(
    () => customerAlerts.filter((alert) => getAlertStatusBucket(alert.status) === 'active'),
    [customerAlerts],
  );
  const resolvedAlerts = useMemo(
    () => customerAlerts.filter((alert) => getAlertStatusBucket(alert.status) === 'resolved'),
    [customerAlerts],
  );
  const filteredAlerts = useMemo(
    () => normalizedAlerts.filter((alert) => getAlertStatusBucket(alert.status) === alertFilter),
    [alertFilter, normalizedAlerts],
  );
  const activeSeverityCounts = useMemo(
    () =>
      activeAlerts.reduce(
        (counts, alert) => {
          if (Object.hasOwn(counts, alert.severity)) {
            counts[alert.severity] += 1;
          }

          return counts;
        },
        { critical: 0, high: 0, medium: 0, low: 0 },
      ),
    [activeAlerts],
  );
  const alertFilterCount = alertFilter === 'resolved' ? resolvedAlerts.length : activeAlerts.length;

  if (!customer) {
    return (
      <div className="admin-shell">
        <main className="admin-page admin-page--detail">
          <SectionCard>
            <div className="admin-empty-state admin-empty-state--detail">
              <p className="admin-access__eyebrow">Cliente admin</p>
              <h1>Cliente non trovato</h1>
              <p>Il record cliente richiesto non esiste nell'attuale set di dati mock dell'admin.</p>
              <div className="admin-inline-actions">
                <Link className="admin-button admin-button--primary" to="/admin">
                  Torna all'admin
                </Link>
              </div>
            </div>
          </SectionCard>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <main className="admin-page admin-page--detail">
        <PageHeader
          description={`${customer.locationLabel}, ${customer.region} - ${customer.cropType} - ${customer.status}`}
          title={customer.farmerName}
          trailing={
            <div className="admin-header-actions">
              <Link className="admin-button admin-button--ghost" to="/admin">
                Torna all'admin
              </Link>
            </div>
          }
        />

        <SectionCard>
          <section className="admin-customer-hero" aria-label="Panoramica cliente">
            <div className="admin-customer-hero__header">
              <div>
                <p className="admin-access__eyebrow">Profilo cliente</p>
                <h2 className="admin-customer-hero__title">{customer.farmName}</h2>
              </div>
              <span className="admin-plan-chip">{customer.servicePlan}</span>
            </div>

            <div className="admin-customer-hero__meta">
              <div>
                <span>Località</span>
                <strong>{customer.locationLabel}</strong>
              </div>
              <div>
                <span>Area</span>
                <strong>{customer.region}</strong>
              </div>
              <div>
                <span>Coltura</span>
                <strong>{customer.cropType}</strong>
              </div>
              <div>
                <span>Superficie</span>
                <strong>{customer.hectares} ha</strong>
              </div>
              <div>
                <span>Appezzamenti</span>
                <strong>{customer.parcelCount}</strong>
              </div>
              <div>
                <span>Stato</span>
                <strong>{customer.status}</strong>
              </div>
            </div>
          </section>
        </SectionCard>

        <section className="admin-stats admin-stats--detail" aria-label="Riepilogo allerte cliente">
          <SectionCard>
            <p className="admin-stat__label">Allerte totali</p>
            <strong className="admin-stat__value">{activeAlerts.length}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Critiche</p>
            <strong className="admin-stat__value">{activeSeverityCounts.critical}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Alte</p>
            <strong className="admin-stat__value">{activeSeverityCounts.high}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Medie</p>
            <strong className="admin-stat__value">{activeSeverityCounts.medium}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Basse</p>
            <strong className="admin-stat__value">{activeSeverityCounts.low}</strong>
          </SectionCard>
        </section>

        <section className="admin-alert-listing" aria-label="Allerte cliente">
          <div className="admin-results__header">
            <div className="admin-results__header-copy">
              <p className="admin-results__count">
                {alertFilterCount} {alertFilterCount === 1 ? 'allerta' : 'allerte'} {alertFilter === 'resolved' ? 'risolte' : 'attive'}
              </p>
            </div>

            <div
              aria-label="Filtra le allerte del cliente per stato"
              className="admin-alert-toggle"
              role="tablist"
            >
              <button
                aria-selected={alertFilter === 'active'}
                className={`admin-alert-toggle__button${alertFilter === 'active' ? ' is-active' : ''}`}
                onClick={() => setAlertFilter('active')}
                role="tab"
                type="button"
              >
                Attive
              </button>
              <button
                aria-selected={alertFilter === 'resolved'}
                className={`admin-alert-toggle__button${alertFilter === 'resolved' ? ' is-active' : ''}`}
                onClick={() => setAlertFilter('resolved')}
                role="tab"
                type="button"
              >
                Risolte
              </button>
            </div>
          </div>

          {filteredAlerts.length > 0 ? (
            <div className="admin-customer-alert-stack">
              {filteredAlerts.map((alert) => (
                <AdminCustomerAlert alert={alert} key={alert.id} />
              ))}
            </div>
          ) : (
            <SectionCard>
              <div className="admin-empty-state admin-empty-state--detail">
                <h2>{alertFilter === 'resolved' ? 'Nessuna allerta risolta' : 'Nessuna allerta attiva'}</h2>
                <p>
                  {alertFilter === 'resolved'
                    ? 'Le allerte risolte del cliente compariranno qui una volta chiusi i relativi problemi nella console admin mock.'
                    : 'Questo account al momento non presenta criticità nella console admin mock. Le nuove allerte compariranno qui quando verranno generate.'}
                </p>
              </div>
            </SectionCard>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminCustomerPage;
