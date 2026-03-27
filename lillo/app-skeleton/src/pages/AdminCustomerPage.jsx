import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlertDetailBlock from '../components/AlertDetailBlock';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';
import { adminCustomers } from '../data/adminMockData';
import AdminAccessGate, { ADMIN_ACCESS_KEY, ADMIN_PASSCODE, hasMockAdminAccess, useAdminDocumentScroll } from './adminAccess';

const ACTIVE_ALERT_STATUSES = new Set(['new', 'active', 'open', 'ongoing', 'monitoring', 'in-progress', 'in_progress']);
const RESOLVED_ALERT_STATUSES = new Set(['resolved', 'closed', 'dismissed', 'completed']);

function formatAlertTime(alert) {
  if (typeof alert.occurredMinutesAgo === 'number') {
    return `${alert.occurredMinutesAgo} min ago`;
  }

  if (typeof alert.occurredHoursAgo === 'number') {
    return `${alert.occurredHoursAgo} h ago`;
  }

  if (alert.timestampLabel) {
    return alert.timestampLabel;
  }

  return 'Recent';
}

function formatSeverityLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildFallbackSources(alert) {
  const signal = alert.sourceSummary ?? alert.summary ?? 'Integrated alert signals are available for this event.';
  const label = alert.sourceLabel ?? alert.sourceSummary ?? 'Integrated signals';

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
          label: source.label ?? source.name ?? source.source ?? 'Integrated signal',
          signal: source.signal ?? source.summary ?? source.value ?? alert.sourceSummary ?? alert.summary ?? 'Signal detail unavailable.',
        }))
      : buildFallbackSources(alert);

  return {
    id: alert.id,
    severity: alert.severity,
    timestampLabel: formatAlertTime(alert),
    title: alert.title ?? 'Untitled alert',
    summary: alert.summary ?? alert.sourceSummary ?? 'No summary available for this alert.',
    field: {
      name: alert.field?.name ?? alert.fieldName ?? 'Unknown field',
    },
    status: alert.status,
    sources: normalizedSources,
    integratedSummary: alert.integratedSummary ?? alert.whyTriggered ?? alert.summary ?? alert.sourceSummary ?? 'Integrated explanation unavailable.',
    riskLine: typeof alert.riskScore === 'number' ? `${alert.riskScore}% ${formatSeverityLabel(alert.severity)} risk` : null,
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
  const [hasAccess, setHasAccess] = useState(hasMockAdminAccess);
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertFilter, setAlertFilter] = useState('active');

  useEffect(() => {
    setHasAccess(hasMockAdminAccess());
  }, []);

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
  const alertFilterLabel = alertFilter === 'resolved' ? 'resolved' : 'active';

  function handleGateSubmit(event) {
    event.preventDefault();

    if (passcode !== ADMIN_PASSCODE) {
      setErrorMessage('Use the demo passcode `azienda-demo` to open the mock admin console.');
      return;
    }

    window.sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
    setHasAccess(true);
    setPasscode('');
    setErrorMessage('');
  }

  if (!hasAccess) {
    return (
      <AdminAccessGate
        errorMessage={errorMessage}
        onPasscodeChange={setPasscode}
        onSubmit={handleGateSubmit}
        passcode={passcode}
      />
    );
  }

  if (!customer) {
    return (
      <div className="admin-shell">
        <main className="admin-page admin-page--detail">
          <SectionCard>
            <div className="admin-empty-state admin-empty-state--detail">
              <p className="admin-access__eyebrow">Admin customer</p>
              <h1>Customer not found</h1>
              <p>The requested customer record does not exist in the current mock admin data set.</p>
              <div className="admin-inline-actions">
                <Link className="admin-button admin-button--primary" to="/admin">
                  Back to admin
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
                Back to admin
              </Link>
            </div>
          }
        />

        <SectionCard>
          <section className="admin-customer-hero" aria-label="Customer overview">
            <div className="admin-customer-hero__header">
              <div>
                <p className="admin-access__eyebrow">Customer profile</p>
                <h2 className="admin-customer-hero__title">{customer.farmName}</h2>
              </div>
              <span className="admin-plan-chip">{customer.servicePlan}</span>
            </div>

            <div className="admin-customer-hero__meta">
              <div>
                <span>Location</span>
                <strong>{customer.locationLabel}</strong>
              </div>
              <div>
                <span>Region</span>
                <strong>{customer.region}</strong>
              </div>
              <div>
                <span>Crop type</span>
                <strong>{customer.cropType}</strong>
              </div>
              <div>
                <span>Surface</span>
                <strong>{customer.hectares} ha</strong>
              </div>
              <div>
                <span>Parcels</span>
                <strong>{customer.parcelCount}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{customer.status}</strong>
              </div>
            </div>
          </section>
        </SectionCard>

        <section className="admin-stats admin-stats--detail" aria-label="Customer alert summary">
          <SectionCard>
            <p className="admin-stat__label">Total alerts</p>
            <strong className="admin-stat__value">{activeAlerts.length}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Critical</p>
            <strong className="admin-stat__value">{activeSeverityCounts.critical}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">High</p>
            <strong className="admin-stat__value">{activeSeverityCounts.high}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Medium</p>
            <strong className="admin-stat__value">{activeSeverityCounts.medium}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Low</p>
            <strong className="admin-stat__value">{activeSeverityCounts.low}</strong>
          </SectionCard>
        </section>

        <section className="admin-alert-listing" aria-label="Customer alerts">
          <div className="admin-results__header">
            <div className="admin-results__header-copy">
              <p className="admin-results__count">
                {alertFilterCount} {alertFilterLabel} {alertFilterCount === 1 ? 'alert' : 'alerts'}
              </p>
            </div>

            <div
              aria-label="Filter customer alerts by status"
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
                Active
              </button>
              <button
                aria-selected={alertFilter === 'resolved'}
                className={`admin-alert-toggle__button${alertFilter === 'resolved' ? ' is-active' : ''}`}
                onClick={() => setAlertFilter('resolved')}
                role="tab"
                type="button"
              >
                Resolved
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
                <h2>{alertFilter === 'resolved' ? 'No resolved alerts' : 'No active alerts'}</h2>
                <p>
                  {alertFilter === 'resolved'
                    ? 'Resolved customer alerts will appear here once issues are closed in the mock admin console.'
                    : 'This account is currently quiet in the mock admin console. New alerts will appear here when generated.'}
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
