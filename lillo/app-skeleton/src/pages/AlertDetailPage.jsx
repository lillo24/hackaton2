import React from 'react';
import { Link } from 'react-router-dom';
import AlertDiagnosisFlow from '../components/AlertDiagnosisFlow';
import AlertDetailBlock from '../components/AlertDetailBlock';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

const DIAGNOSIS_FLOW_PRESETS = [
  {
    id: 'peronospora-risk',
    matches(alert) {
      return alert?.id === 'humidity-spike' && /peronospora/i.test(alert?.title ?? '');
    },
    profile: {
      title: 'Rischio Peronospora',
      severityLabel: 'Alto',
      summary:
        'Pioggia recente, bagnatura fogliare persistente e umidita elevata indicano una finestra favorevole alla Peronospora.',
      plantLabel: 'Peronospora',
      problemTitle: 'Problema identificato',
      problemSummary: 'I dati rilevati indicano una probabile finestra di infezione da Peronospora.',
      evidenceItems: [
        'Pioggia recente',
        'Bagnatura fogliare prolungata',
        'Umidita elevata',
        'Temperature favorevoli',
      ],
      signalsTitle: 'Segnali rilevati',
      signalItems: [
        {
          label: 'Meteo',
          type: 'weather',
          description: 'Pioggia recente e condizioni di scarsa asciugatura.',
        },
        {
          label: 'Sensori chioma',
          type: 'sensor',
          description: 'Bagnatura fogliare persistente dopo l evento di pioggia.',
        },
        {
          label: 'Sensori aria',
          type: 'sensor',
          description: 'Umidita alta e temperatura nel range favorevole.',
        },
      ],
      reasoningTitle: 'Perche pensiamo sia Peronospora',
      reasoningText:
        'Dopo l evento di pioggia, la chioma e rimasta bagnata per molte ore. L umidita e rimasta elevata e la temperatura si e mantenuta in una fascia favorevole allo sviluppo della Peronospora. La combinazione di questi segnali rende probabile una finestra di infezione in questo appezzamento.',
      interpretationText:
        'Abbiamo combinato meteo e sensori di campo per individuare condizioni compatibili con l avvio di un infezione. Il rischio e alto, quindi questo appezzamento va controllato subito.',
      actionTitle: 'Cosa fare ora',
      actionItems: [
        'Controlla le foglie nelle zone piu umide.',
        'Dai priorita alle file meno ventilate.',
        'Verifica l evoluzione nelle prossime ore.',
        'Valuta l intervento secondo protocollo agronomico.',
      ],
      impactTitle: 'Perche intervenire ora conta',
      impactText:
        'Intervenire presto aiuta a ridurre il rischio di diffusione e a non perdere la finestra utile di trattamento.',
    },
  },
];

function getDiagnosisFlowProfile(alert) {
  const matchingPreset = DIAGNOSIS_FLOW_PRESETS.find((preset) => preset.matches(alert));
  return matchingPreset?.profile ?? null;
}

function AlertDetailPage({ alert }) {
  if (!alert) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="Alert"
          title="No alert selected yet"
          description="Open an alert from the Alerts page to inspect source signals and recommended action."
        />
        <SectionCard subtitle="This page is reserved for one selected alert detail view." title="Quiet placeholder">
          <Link className="inline-link" to="/alerts">
            Open alerts list
          </Link>
        </SectionCard>
      </div>
    );
  }

  const isNewNotification = alert.status === 'new';
  const topBadges = [];

  if (isNewNotification) {
    topBadges.push(
      <p className="alert-detail-notification" key="new-notification">
        <span aria-hidden="true" className="alert-detail-notification__dot" />
        <span>Nuova notifica</span>
      </p>,
    );
  }

  const diagnosisProfile = getDiagnosisFlowProfile(alert);

  if (diagnosisProfile) {
    return (
      <div className="page alert-detail-page alert-detail-page--diagnosis">
        <AlertDiagnosisFlow alert={alert} profile={diagnosisProfile} topBadges={topBadges} />
      </div>
    );
  }

  return (
    <div className="page alert-detail-page">
      <AlertDetailBlock alert={alert} integratedPanelId="alert-detail-integrated-content" topBadges={topBadges} />
    </div>
  );
}

export default AlertDetailPage;
