import { useEffect, useState } from 'react';
import SectionCard from './SectionCard';
import StatusBadge from './StatusBadge';

function formatUrgency(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return 'Unknown';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatFieldLabel(field) {
  if (!field?.name) {
    return 'Unknown field';
  }

  if (!field.plotCode) {
    return field.name;
  }

  return `${field.name} (${field.plotCode})`;
}

function AlertDetailBlock({
  alert,
  className = '',
  headingLevel = 'h1',
  integratedInitiallyOpen = false,
  integratedCollapsible = true,
  integratedPanelId,
  actionLabel = 'Action to do',
  showField = true,
  showAction = true,
  showHeader = true,
  showIntegrated = true,
  showIntegratedDetail = true,
  showProblems = true,
  showSummary = true,
  showTimestamp = true,
  topBadges = [],
}) {
  const [isIntegratedOpen, setIsIntegratedOpen] = useState(integratedInitiallyOpen);
  const safeTopBadges = Array.isArray(topBadges) ? topBadges.filter(Boolean) : [];
  const detailSeverityClass = `alert-detail-page--${alert.severity}`;
  const riskLine =
    typeof alert.riskScore === 'number' ? `${alert.riskScore}% ${formatUrgency(alert.severity)} risk` : alert.riskLine ?? null;
  const integratedSummary = alert.integratedSummary ?? alert.whyTriggered;
  const integratedDetail = showIntegratedDetail ? alert.relevanceReason ?? null : null;
  const HeadingTag = headingLevel;

  useEffect(() => {
    if (!integratedCollapsible) {
      return;
    }

    setIsIntegratedOpen(integratedInitiallyOpen);
  }, [alert?.id, integratedCollapsible, integratedInitiallyOpen]);

  function renderIntegratedContent() {
    return (
      <div className="roadmap-step__content" id={integratedPanelId}>
        {riskLine ? <p className="alert-detail-risk-line">{riskLine}</p> : null}
        <p className="detail-text">{integratedSummary}</p>
        {integratedDetail ? <p className="detail-text detail-text--compact">{integratedDetail}</p> : null}
      </div>
    );
  }

  return (
    <article className={`alert-detail-block ${detailSeverityClass}${className ? ` ${className}` : ''}`}>
      {showHeader ? (
        <SectionCard className={`alert-detail-hero alert-detail-hero--${alert.severity}`}>
          <div className="alert-detail-hero__topline">
            <div className="alert-detail-priority-row">
              <StatusBadge tone={alert.severity}>{formatUrgency(alert.severity)}</StatusBadge>
              {safeTopBadges}
            </div>
            {showTimestamp ? <p className="alert-detail-triggered-inline">{alert.timestampLabel}</p> : null}
          </div>

          <div className="alert-detail-hero__header">
            <HeadingTag className="alert-detail-title">{alert.title}</HeadingTag>
            {showSummary ? <p className="detail-text alert-detail-summary">{alert.summary}</p> : null}
            {showField ? (
              <p className="alert-detail-field">
                <span className="alert-detail-field-label">Field</span>
                <span>{formatFieldLabel(alert.field)}</span>
              </p>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      <div className="alert-roadmap" role="group" aria-label={`${alert.title} detail`}>
        {showProblems ? (
          <section className="roadmap-step roadmap-step--problems" style={{ '--step-delay': '0ms' }}>
            <header className="roadmap-step__header">
              <h3>Problems</h3>
            </header>
            <ul className="roadmap-problem-list">
              {alert.sources.map((source) => (
                <li className="roadmap-problem" key={source.id}>
                  <p className="roadmap-problem__source">{source.label}</p>
                  <p className="roadmap-problem__signal">{source.signal}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {showIntegrated ? (
          <section className="roadmap-step roadmap-step--integrated" style={{ '--step-delay': '140ms' }}>
            {integratedCollapsible ? (
              <>
                <button
                  aria-controls={integratedPanelId}
                  aria-expanded={isIntegratedOpen}
                  className="roadmap-step__toggle"
                  onClick={() => setIsIntegratedOpen((currentValue) => !currentValue)}
                  type="button"
                >
                  <span className="roadmap-step__toggle-label">Integrated</span>
                  <span aria-hidden="true" className={`roadmap-step__toggle-arrow${isIntegratedOpen ? ' is-open' : ''}`} />
                </button>

                {isIntegratedOpen ? renderIntegratedContent() : null}
              </>
            ) : (
              <>
                <header className="roadmap-step__header">
                  <h3>Integrated</h3>
                </header>
                {renderIntegratedContent()}
              </>
            )}
          </section>
        ) : null}

        {showAction ? (
          <section className="roadmap-step roadmap-step--action" style={{ '--step-delay': '280ms' }}>
            <header className="roadmap-step__header">
              <h3>{actionLabel}</h3>
            </header>
            <p className="detail-text">{alert.suggestedAction}</p>
          </section>
        ) : null}
      </div>
    </article>
  );
}

export default AlertDetailBlock;
