import React from 'react';

function SectionCard({ title, subtitle, children, className = '' }) {
  const sectionClassName = className ? `section-card ${className}` : 'section-card';

  return (
    <section className={sectionClassName}>
      {(title || subtitle) && (
        <div className="section-card__header">
          {title ? <h3 className="section-card__title">{title}</h3> : null}
          {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export default SectionCard;
