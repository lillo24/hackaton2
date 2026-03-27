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
          description: "Bagnatura fogliare persistente dopo l'evento di pioggia.",
        },
        {
          label: 'Sensori aria',
          type: 'sensor',
          description: 'Umidita alta e temperatura nel range favorevole.',
        },
      ],
      reasoningTitle: 'Perche pensiamo sia Peronospora',
      reasoningText:
        'Dopo la pioggia, la chioma e rimasta bagnata a lungo. L umidita si e mantenuta elevata e la temperatura e rimasta in un intervallo favorevole allo sviluppo della Peronospora. La combinazione di questi segnali indica una probabile finestra di infezione in questo appezzamento.',
      interpretationText:
        "Abbiamo combinato meteo e sensori di campo per individuare condizioni compatibili con l'avvio di un'infezione. Il rischio e alto, quindi questo appezzamento va controllato subito.",
      actionTitle: 'Cosa fare adesso',
      actionSteps: [
        {
          title: 'Entra nella prima finestra utile',
          text: 'Valuta un antiperonosporico con attivita endoterapica o post-infezione consentito da disciplinare, etichetta e bollettino locale.',
        },
        {
          title: 'Riduci subito la bagnatura della chioma',
          text: 'Dai priorita a spollonatura, germogli bassi e zone meno ventilate per favorire asciugatura e circolazione d aria.',
        },
        {
          title: 'Non trattare con foglie gocciolanti',
          text: 'Aspetta la fine della pioggia e l avvio dell asciugatura; se e prevista nuova pioggia a breve, scegli solo soluzioni compatibili con tempi di assorbimento ed etichetta.',
        },
        {
          title: 'Ricontrolla entro 24-48 ore',
          text: 'Verifica nuova bagnatura fogliare, evoluzione del rischio e comparsa di sintomi per decidere il passo successivo.',
        },
      ],
      actionClosingNote:
        'Agire presto, con il prodotto e il timing corretti, aiuta a contenere la diffusione e a non perdere la finestra di intervento piu efficace.',
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
