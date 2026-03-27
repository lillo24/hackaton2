import StatusBadge from './StatusBadge';

function formatFieldLabel(field) {
  if (!field?.name) {
    return null;
  }

  if (!field.plotCode) {
    return field.name;
  }

  return `${field.name} (${field.plotCode})`;
}

function AlertDiagnosisFlow({ alert, profile, topBadges = [] }) {
  const safeTopBadges = Array.isArray(topBadges) ? topBadges.filter(Boolean) : [];
  const fieldLabel = formatFieldLabel(alert?.field);
  const evidenceItems = profile.evidenceItems ?? [];
  const dataItems = profile.dataItems ?? [];
  const actionItems = profile.actionItems ?? [];

  return (
    <article className={`diagnosis-alert diagnosis-alert--${profile.severityTone ?? 'high'}`}>
      <header className="diagnosis-alert__header">
        <div className="diagnosis-alert__header-main">
          <p className="diagnosis-alert__kicker">{profile.kicker}</p>
          <h1 className="diagnosis-alert__title">{profile.title}</h1>
        </div>
        <div className="diagnosis-alert__status">
          <StatusBadge tone={profile.severityTone ?? 'high'}>{profile.severityLabel}</StatusBadge>
          {safeTopBadges}
        </div>
      </header>

      <p className="diagnosis-alert__summary">{profile.summary}</p>
      {fieldLabel ? (
        <p className="diagnosis-alert__field">
          <span>Block</span>
          <strong>{fieldLabel}</strong>
        </p>
      ) : null}

      <section className="diagnosis-alert__hero" aria-label="Diagnosis focus">
        <div className="diagnosis-alert__plant-card">
          <svg aria-hidden="true" className="diagnosis-alert__plant-art" viewBox="0 0 240 220">
            <path d="M120 212c-5.2 0-9.4-4.2-9.4-9.4V97.8c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4v104.8c0 5.2-4.2 9.4-9.4 9.4Z" fill="#5c3d28" />
            <path d="M109 85.5c-39.7-1.1-62.9-22.2-67.1-60.8 34.7-7.8 61.2 4.3 74.7 34.2 5.6 12.6 2.9 24.4-7.6 26.6Z" fill="#5c9046" />
            <path d="M132.1 90.2c39.4-5.2 58.6-30.7 55.5-73.8-35.5-4.1-60.1 11.1-69.3 42.8-3.9 13.4 1.1 25.4 13.8 31Z" fill="#4d7f3f" />
            <path d="M76.2 152.8c24.2 8.4 44.7 4.8 61.1-10.6-17.8-21.5-39.6-29.7-65-24.3-10.7 2.2-16.5 10.8-15.2 22.7 1.1 9.7 8 12.7 19.1 12.2Z" fill="#6d9e4b" />
            <path d="M162.9 157.2c-22.4 12.2-43.2 11.6-62.2-1.8 14.2-24 34.4-35.4 60.4-34.2 10.9.5 18.2 8.3 19.3 20.3 1 9.9-4.6 14.6-17.5 15.7Z" fill="#6d9e4b" />
            <circle cx="162" cy="72" fill="rgba(221,132,70,0.92)" r="8.8" />
            <circle cx="147" cy="91" fill="rgba(210,112,52,0.9)" r="6.6" />
            <circle cx="171" cy="99" fill="rgba(228,141,80,0.9)" r="5.8" />
          </svg>
          <p className="diagnosis-alert__plant-label">{profile.plantLabel}</p>
        </div>

        <div className="diagnosis-alert__evidence-card">
          <h2>{profile.evidenceTitle}</h2>
          <ul className="diagnosis-alert__evidence-list">
            {evidenceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="diagnosis-alert__section">
        <h2>{profile.detectedPatternTitle}</h2>
        <p>{profile.detectedPatternText}</p>
      </section>

      <section className="diagnosis-alert__section">
        <h2>{profile.dataUsedTitle}</h2>
        <div className="diagnosis-alert__data-grid">
          {dataItems.map((item) => (
            <article className="diagnosis-alert__data-item" key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="diagnosis-alert__section diagnosis-alert__section--action">
        <h2>{profile.actionTitle}</h2>
        <ul className="diagnosis-alert__action-list">
          {actionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="diagnosis-alert__section diagnosis-alert__section--note">
        <h2>{profile.noteTitle}</h2>
        <p>{profile.noteText}</p>
      </section>
    </article>
  );
}

export default AlertDiagnosisFlow;
