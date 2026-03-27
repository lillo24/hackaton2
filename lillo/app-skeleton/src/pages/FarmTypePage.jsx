import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

function FarmTypePage({ farmTypes, selectedFarmId, onSelectFarm, alerts }) {
  const selectedFarm = farmTypes.find((farm) => farm.id === selectedFarmId);
  const actionNowCount = alerts.filter((alert) => alert.severity === 'critical' || alert.severity === 'high').length;
  const primaryCount = alerts.filter((alert) => alert.farmRelevance === 'primary').length;

  if (!selectedFarm) {
    throw new Error(`Farm page cannot render unsupported farm "${selectedFarmId}".`);
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Farm Type"
        title="Choose the live operating profile"
        description="This selection immediately changes alert priority, provenance context, and recommended actions across the workflow."
      />

      <div className="farm-grid">
        {farmTypes.map((farm, index) => (
          <button
            className={`farm-card${farm.id === selectedFarmId ? ' is-active' : ''}`}
            key={farm.id}
            onClick={() => onSelectFarm(farm.id)}
            style={{ '--delay': `${index * 60}ms` }}
            type="button"
          >
            <div className="farm-card__top">
              <div className="farm-card__code">{farm.code}</div>
              <div>
                <h3 className="farm-card__title">{farm.label}</h3>
                <p className="farm-card__description">{farm.description}</p>
              </div>
            </div>

            <div className="farm-card__traits">
              {farm.traits.map((trait) => (
                <span className="farm-card__trait" key={trait}>
                  {trait}
                </span>
              ))}
            </div>

            <div className="farm-card__footer">
              <span>{farm.primarySignal}</span>
              <strong>{farm.id === selectedFarmId ? 'Active profile' : 'Tap to preview'}</strong>
            </div>
          </button>
        ))}
      </div>

      <SectionCard
        subtitle={`The ${selectedFarm.label} profile now controls how alerts are ranked and explained.`}
        title="Live profile snapshot"
      >
        <div className="snapshot-grid">
          <article className="snapshot-card">
            <span className="snapshot-label">Operating focus</span>
            <strong>{selectedFarm.operatingFocus}</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Profile-specific alerts</span>
            <strong>{alerts.length} active signals available in this preview.</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Immediate action queue</span>
            <strong>{actionNowCount} alerts currently need action-first review.</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Primary watchpoint</span>
            <strong>{selectedFarm.primarySignal}</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Profile relevance</span>
            <strong>{primaryCount} alerts are marked primary for this farm.</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Data emphasis</span>
            <strong>{selectedFarm.integrationNote}</strong>
          </article>
        </div>

        <div className="farm-flow-cta">
          <p className="detail-text">
            Next step: open the alerts panel to review prioritized signals for
            {' '}
            {selectedFarm.label}
            .
          </p>
          <Link className="inline-link inline-link--cta" to="/alerts">
            Continue to alerts
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

export default FarmTypePage;
