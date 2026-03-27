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
        'Pioggia recente, bagnatura fogliare persistente e umidità elevata indicano una finestra favorevole alla Peronospora.',
      plantLabel: 'Peronospora',
      problemTitle: 'Problema identificato',
      problemSummary: 'I dati rilevati indicano una probabile finestra di infezione da Peronospora.',
      evidenceItems: [
        'Pioggia recente',
        'Bagnatura fogliare prolungata',
        'Umidità elevata',
        'Temperature favorevoli',
      ],
      signalsTitle: 'Segnali rilevati',
      signalItems: [
        {
          label: 'Meteo',
          type: 'weather',
          description: "Pioggia recente e condizioni di scarsa asciugatura.",
        },
        {
          label: 'Sensori chioma',
          type: 'sensor',
          description: "Bagnatura fogliare persistente dopo l'evento di pioggia.",
        },
        {
          label: 'Sensori aria',
          type: 'sensor',
          description: 'Umidità alta e temperatura nel range favorevole.',
        },
      ],
      reasoningTitle: 'Perché pensiamo sia Peronospora',
      reasoningText:
        'Dopo la pioggia, la chioma è rimasta bagnata a lungo. L’umidità si è mantenuta elevata e la temperatura è rimasta in un intervallo favorevole allo sviluppo della Peronospora. La combinazione di questi segnali indica una probabile finestra di infezione in questo appezzamento.',
      interpretationText:
        "Abbiamo combinato meteo e sensori di campo per individuare condizioni compatibili con l'avvio di un'infezione. Il rischio è alto, quindi questo appezzamento va controllato subito.",
      actionTitle: 'Cosa fare adesso',
      actionSteps: [
        {
          title: 'Controlla le foglie più umide',
          text: 'Cerca i primi segnali nelle zone dove l’asciugatura è più lenta.',
        },
        {
          title: 'Dai priorità alle file meno ventilate',
          text: 'Concentrati prima sulle aree dove l’umidità tende a ristagnare.',
        },
        {
          title: 'Segui l’evoluzione nelle prossime ore',
          text: 'Verifica se le condizioni favorevoli restano attive.',
        },
        {
          title: 'Valuta l’intervento',
          text: 'Procedi secondo il protocollo agronomico adottato.',
        },
      ],
      actionClosingNote:
        'Agire presto aiuta a contenere il rischio di diffusione e a intervenire nella finestra più utile.',
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
