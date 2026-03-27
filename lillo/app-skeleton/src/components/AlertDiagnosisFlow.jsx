import { useEffect, useRef, useState } from 'react';
import StatusBadge from './StatusBadge';
import SourceIcon from './SourceIcon';

function formatFieldLabel(field) {
  if (!field?.name) {
    return null;
  }

  if (!field.plotCode) {
    return field.name;
  }

  return `${field.name} (${field.plotCode})`;
}

function toItalianTimestamp(label) {
  if (typeof label !== 'string' || label.length === 0) {
    return '';
  }

  if (label.includes('hr') && label.includes('min ago')) {
    return label.replace('hr', 'h').replace('min ago', 'min fa').trim();
  }

  if (label.includes('min ago')) {
    return label.replace('min ago', 'min fa').trim();
  }

  if (label.includes('hr ago')) {
    return label.replace('hr ago', 'h fa').trim();
  }

  return label;
}

function resolveSignalIconType(item) {
  if (item?.type) {
    return item.type;
  }

  return 'sensor';
}

function AlertDiagnosisFlow({ alert, profile, topBadges = [] }) {
  const actionSectionRef = useRef(null);
  const [isActionFlowVisible, setIsActionFlowVisible] = useState(false);
  const safeTopBadges = Array.isArray(topBadges) ? topBadges.filter(Boolean) : [];
  const fieldLabel = formatFieldLabel(alert?.field);
  const timestampLabel = toItalianTimestamp(alert?.timestampLabel);
  const evidenceItems = profile.evidenceItems ?? [];
  const signalItems = profile.signalItems ?? [];
  const actionSteps = profile.actionSteps ?? [];
  const severityTone = alert?.severity ?? 'high';

  useEffect(() => {
    if (isActionFlowVisible) {
      return;
    }

    const sectionElement = actionSectionRef.current;

    if (!sectionElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActionFlowVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.32,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [isActionFlowVisible]);

  return (
    <article className={`diagnosis-alert diagnosis-alert--${severityTone}`}>
      <header className="diagnosis-alert__hero">
        <div className="diagnosis-alert__hero-top">
          <div className="diagnosis-alert__status-row">
            <StatusBadge tone={severityTone}>{profile.severityLabel}</StatusBadge>
            {safeTopBadges}
          </div>
          {timestampLabel ? <p className="diagnosis-alert__timestamp">{timestampLabel}</p> : null}
        </div>

        <div className="diagnosis-alert__hero-main">
          <h1 className="diagnosis-alert__title">{profile.title}</h1>
          <p className="diagnosis-alert__summary">{profile.summary}</p>
          {fieldLabel ? (
            <p className="diagnosis-alert__field">
              <span>Appezzamento</span>
              <strong>{fieldLabel}</strong>
            </p>
          ) : null}
        </div>
      </header>

      <section className="diagnosis-section diagnosis-section--problem" aria-label={profile.problemTitle}>
        <header className="diagnosis-section__header">
          <h2>{profile.problemTitle}</h2>
        </header>

        <div className="diagnosis-problem">
          <div className="diagnosis-problem__visual">
            <svg aria-hidden="true" className="diagnosis-problem__plant-art" viewBox="0 0 240 220">
              <path d="M120 212c-5.2 0-9.4-4.2-9.4-9.4V97.8c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4v104.8c0 5.2-4.2 9.4-9.4 9.4Z" fill="#5c3d28" />
              <path d="M109 85.5c-39.7-1.1-62.9-22.2-67.1-60.8 34.7-7.8 61.2 4.3 74.7 34.2 5.6 12.6 2.9 24.4-7.6 26.6Z" fill="#5c9046" />
              <path d="M132.1 90.2c39.4-5.2 58.6-30.7 55.5-73.8-35.5-4.1-60.1 11.1-69.3 42.8-3.9 13.4 1.1 25.4 13.8 31Z" fill="#4d7f3f" />
              <path d="M76.2 152.8c24.2 8.4 44.7 4.8 61.1-10.6-17.8-21.5-39.6-29.7-65-24.3-10.7 2.2-16.5 10.8-15.2 22.7 1.1 9.7 8 12.7 19.1 12.2Z" fill="#6d9e4b" />
              <path d="M162.9 157.2c-22.4 12.2-43.2 11.6-62.2-1.8 14.2-24 34.4-35.4 60.4-34.2 10.9.5 18.2 8.3 19.3 20.3 1 9.9-4.6 14.6-17.5 15.7Z" fill="#6d9e4b" />
              <circle cx="162" cy="72" fill="rgba(221,132,70,0.92)" r="8.8" />
              <circle cx="147" cy="91" fill="rgba(210,112,52,0.9)" r="6.6" />
              <circle cx="171" cy="99" fill="rgba(228,141,80,0.9)" r="5.8" />
            </svg>
          </div>

          <div className="diagnosis-problem__content">
            <h3>{profile.plantLabel}</h3>
            <p className="diagnosis-problem__summary">{profile.problemSummary}</p>
            <p className="diagnosis-problem__interpretation">{profile.interpretationText}</p>
            <ul className="diagnosis-evidence-list" aria-label="Evidenze principali">
              {evidenceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="diagnosis-section">
        <header className="diagnosis-section__header">
          <h2>{profile.signalsTitle}</h2>
        </header>
        <ul className="diagnosis-signal-list">
          {signalItems.map((item) => (
            <li className="diagnosis-signal-list__item" key={item.label}>
              <div className="diagnosis-signal-list__copy">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
              <span className="diagnosis-signal-list__icon" aria-hidden="true">
                <SourceIcon type={resolveSignalIconType(item)} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="diagnosis-section diagnosis-section--reasoning">
        <header className="diagnosis-section__header">
          <h2>{profile.reasoningTitle}</h2>
        </header>
        <p>{profile.reasoningText}</p>
      </section>

      <section
        className={`diagnosis-section diagnosis-section--action${isActionFlowVisible ? ' is-visible' : ''}`}
        ref={actionSectionRef}
      >
        <header className="diagnosis-section__header">
          <h2>{profile.actionTitle}</h2>
        </header>
        <div
          className={`diagnosis-action-flow${isActionFlowVisible ? ' is-visible' : ''}`}
          role="list"
          aria-label="Percorso azioni consigliate"
        >
          {actionSteps.map((step, index) => (
            <article
              className="diagnosis-action-step"
              key={step.title}
              role="listitem"
              style={{ '--action-step-delay': `${index * 260}ms` }}
            >
              <div className="diagnosis-action-step__marker">
                <span className="diagnosis-action-step__bubble">{index + 1}</span>
              </div>
              <div className="diagnosis-action-step__content">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
        <ul className="diagnosis-action-list-mobile">
          {actionSteps.map((step) => (
            <li key={`${step.title}-mobile`}>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          ))}
        </ul>
        {profile.actionClosingNote ? <p className="diagnosis-action-note">{profile.actionClosingNote}</p> : null}
      </section>
    </article>
  );
}

export default AlertDiagnosisFlow;
