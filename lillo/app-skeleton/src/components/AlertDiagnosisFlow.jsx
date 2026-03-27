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

function DiseaseProblemVisual() {
  return (
    <svg aria-hidden="true" className="diagnosis-problem__plant-art diagnosis-problem__plant-art--disease" viewBox="0 0 240 220">
      <path d="M120 212c-5.2 0-9.4-4.2-9.4-9.4V97.8c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4v104.8c0 5.2-4.2 9.4-9.4 9.4Z" fill="#5c3d28" />
      <path d="M109 85.5c-39.7-1.1-62.9-22.2-67.1-60.8 34.7-7.8 61.2 4.3 74.7 34.2 5.6 12.6 2.9 24.4-7.6 26.6Z" fill="#5c9046" />
      <path d="M132.1 90.2c39.4-5.2 58.6-30.7 55.5-73.8-35.5-4.1-60.1 11.1-69.3 42.8-3.9 13.4 1.1 25.4 13.8 31Z" fill="#4d7f3f" />
      <path d="M76.2 152.8c24.2 8.4 44.7 4.8 61.1-10.6-17.8-21.5-39.6-29.7-65-24.3-10.7 2.2-16.5 10.8-15.2 22.7 1.1 9.7 8 12.7 19.1 12.2Z" fill="#6d9e4b" />
      <path d="M162.9 157.2c-22.4 12.2-43.2 11.6-62.2-1.8 14.2-24 34.4-35.4 60.4-34.2 10.9.5 18.2 8.3 19.3 20.3 1 9.9-4.6 14.6-17.5 15.7Z" fill="#6d9e4b" />
      <circle cx="162" cy="72" fill="rgba(221,132,70,0.92)" r="8.8" />
      <circle cx="147" cy="91" fill="rgba(210,112,52,0.9)" r="6.6" />
      <circle cx="171" cy="99" fill="rgba(228,141,80,0.9)" r="5.8" />
    </svg>
  );
}

function FrostProblemVisual() {
  return (
    <svg aria-hidden="true" className="diagnosis-problem__plant-art diagnosis-problem__plant-art--frost" viewBox="0 0 240 220">
      <defs>
        <linearGradient id="frost-stem-gradient" x1="120" x2="120" y1="74" y2="214" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6a4d3a" />
          <stop offset="1" stopColor="#4c3629" />
        </linearGradient>
        <linearGradient id="frost-shoot-gradient-left" x1="59" x2="125" y1="124" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d927e" />
          <stop offset="1" stopColor="#a8c5b2" />
        </linearGradient>
        <linearGradient id="frost-shoot-gradient-right" x1="118" x2="187" y1="124" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5f846f" />
          <stop offset="1" stopColor="#9cbca9" />
        </linearGradient>
        <radialGradient id="frost-halo-gradient" cx="0" cy="0" r="1" gradientTransform="translate(120 108) rotate(90) scale(86 88)" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(195,229,255,0.38)" />
          <stop offset="1" stopColor="rgba(195,229,255,0)" />
        </radialGradient>
        <radialGradient id="frost-bud-gradient" cx="0" cy="0" r="1" gradientTransform="translate(120 71) rotate(90) scale(19 18)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4fbff" />
          <stop offset="1" stopColor="#9fc9ea" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="108" fill="url(#frost-halo-gradient)" rx="86" ry="88" />

      <path d="M120.4 213.4c-5.4 0-9.8-4.4-9.8-9.8V99.2c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8v104.4c0 5.4-4.4 9.8-9.8 9.8Z" fill="url(#frost-stem-gradient)" />
      <path d="M111.4 95.6c-33.9-5.7-52.3-27.9-54.8-66.2 33.2-1.4 54.6 11.4 63.8 38.2 4 11.6.2 24.7-9 28Z" fill="url(#frost-shoot-gradient-left)" />
      <path d="M130.7 95.4c34.6-2.1 54.8-22.1 60-59.4-33.6-5.1-57.6 5.5-71.7 31.6-6.1 11.2-.6 24.8 11.7 27.8Z" fill="url(#frost-shoot-gradient-right)" />
      <path d="M84.4 154.6c20.3 8.4 38.7 6 54.8-7.3-13.4-20.3-31.7-29.8-54.5-28.5-9.6.6-16.2 7.4-17.4 18-1 8.8 4 13.4 17.1 17.8Z" fill="#89ad99" />
      <path d="M158.1 156.2c-20.8 9.6-39.8 8.2-56.6-4.2 12.2-21.5 30.2-32.7 53.5-33.4 9.8-.3 17.1 5.8 19.4 16.2 2 8.6-2.5 13.8-16.3 21.4Z" fill="#84a895" />

      <path d="M109 77.4c3.7-8.2 8.6-12.3 14.8-12.3 6.5 0 11.4 4.1 14.9 12.3-3 7.7-7.9 11.6-14.9 11.6-6.8 0-11.8-3.9-14.8-11.6Z" fill="url(#frost-bud-gradient)" stroke="rgba(123,165,198,0.78)" strokeWidth="1.2" />
      <path d="M105.5 61.8c3.4-2.7 6.2-3.7 8.4-2.8M136.4 59.8c2.5-.7 5.1.2 7.8 2.5" fill="none" stroke="rgba(169,208,238,0.78)" strokeLinecap="round" strokeWidth="1.2" />

      <path d="M32 78.8c15.3-6.7 31-6.9 47.3-.7M29 96.4c14.2-7.2 30.3-8.5 48.2-3.6M30.5 114c14.5-5.6 30.9-6 49-.9" fill="none" stroke="rgba(150,194,230,0.74)" strokeLinecap="round" strokeWidth="2.1" />
      <path d="M208 83.2c-14.1-5.6-29-5.2-44.5 1.3M208 100.4c-12.9-6.1-27.4-6.4-43.6-.8M204.8 117.2c-12.3-4.8-25.8-4.7-40.6.3" fill="none" stroke="rgba(148,192,227,0.66)" strokeLinecap="round" strokeWidth="2" />

      <g fill="rgba(223,241,255,0.94)">
        <circle cx="69.8" cy="49.5" r="2.1" />
        <circle cx="84.4" cy="39.8" r="1.8" />
        <circle cx="159.8" cy="42.4" r="2.1" />
        <circle cx="173.1" cy="52.3" r="1.7" />
        <circle cx="146.5" cy="31.8" r="1.5" />
        <circle cx="95.8" cy="31.6" r="1.4" />
      </g>

      <g stroke="rgba(211,237,255,0.92)" strokeLinecap="round" strokeWidth="1.35">
        <path d="M70.6 67.4v8.4M66.4 71.6H74.8M67.7 68.7l5.8 5.8M73.5 68.7l-5.8 5.8" />
        <path d="M170.5 65v8.4M166.3 69.2h8.4M167.6 66.3l5.8 5.8M173.4 66.3l-5.8 5.8" />
        <path d="M120.8 35.8v7.5M117.1 39.6h7.4M118.3 37.1l5 5M123.3 37.1l-5 5" />
      </g>
    </svg>
  );
}

function ProblemVisual({ variant = 'disease' }) {
  if (variant === 'frost') {
    return <FrostProblemVisual />;
  }

  return <DiseaseProblemVisual />;
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
  const visualVariant = profile.visualVariant ?? 'disease';
  const problemVisualStyle = visualVariant === 'frost'
    ? {
        background:
          'linear-gradient(160deg, rgba(136, 187, 228, 0.2), rgba(255, 255, 255, 0) 68%), linear-gradient(180deg, rgba(239, 247, 255, 0.96), rgba(255, 255, 255, 0.98))',
      }
    : undefined;

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
          <div
            className={`diagnosis-problem__visual diagnosis-problem__visual--${visualVariant}`}
            style={problemVisualStyle}
          >
            <ProblemVisual variant={visualVariant} />
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
