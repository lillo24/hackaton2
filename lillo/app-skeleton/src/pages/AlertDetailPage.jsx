import React from 'react';
import { Link } from 'react-router-dom';
import AlertDiagnosisFlow from '../components/AlertDiagnosisFlow';
import AlertDetailBlock from '../components/AlertDetailBlock';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

const DIAGNOSIS_FLOW_PRESETS = [
  // Only dedicated diagnosis-ready alerts use the premium diagnosis flow.
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
      visualVariant: 'disease',
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
  {
    id: 'gelate-risk',
    matches(alert) {
      return alert?.id === 'frost-pocket';
    },
    profile: {
      title: 'Rischio Gelate',
      severityLabel: 'Critico',
      summary: "Sensori e previsioni indicano un evento di gelo prima dell'alba nelle file piu fredde.",
      visualVariant: 'frost',
      plantLabel: 'Gelata imminente',
      problemTitle: 'Problema identificato',
      problemSummary: 'I dati rilevati indicano un probabile evento di gelata localizzata nel terrazzamento piu freddo.',
      evidenceItems: [
        'Temperatura aria in rapido calo',
        'Minimo previsto sotto zero',
        'Vento debole',
        'Storico di sacca fredda nel blocco',
      ],
      signalsTitle: 'Segnali rilevati',
      signalItems: [
        {
          label: 'Previsione notturna',
          type: 'weather',
          description: "Il minimo previsto scende a -1.8 °C prima dell'alba e il vento restera debole, favorendo l'accumulo di aria fredda.",
        },
        {
          label: 'Sensori aria',
          type: 'sensor',
          description: 'Nel blocco la temperatura e gia scesa a 0.4 °C con umidita elevata negli ultimi cicli di campionamento.',
        },
        {
          label: 'Storico appezzamento',
          type: 'sensor',
          description: 'Questo terrazzamento si raffredda prima delle file vicine e concentra piu facilmente le sacche fredde.',
        },
      ],
      reasoningTitle: 'Perche pensiamo sia Gelata',
      reasoningText: "Il blocco sta gia perdendo temperatura rapidamente. Le previsioni portano il minimo sotto zero prima dell'alba, il vento restera debole e questo terrazzamento tende ad accumulare aria fredda. La combinazione di raffreddamento reale, previsione critica e comportamento storico rende probabile una gelata localizzata.",
      interpretationText: "Abbiamo combinato sensori di campo, previsione notturna e comportamento storico del blocco per capire se il calo termico restera solo un raffreddamento o diventera una gelata. In questo caso il rischio e critico, quindi la protezione va attivata subito.",
      actionTitle: 'Cosa fare adesso',
      actionSteps: [
        {
          title: 'Attiva subito la protezione anti-gelo',
          text: 'Avvia i sistemi disponibili prima che la temperatura scenda sotto zero in modo stabile, secondo il protocollo aziendale.',
        },
        {
          title: 'Dai priorita alle file piu fredde',
          text: "Concentrati prima sul terrazzamento inferiore e sulle zone dove l'aria fredda si accumula piu facilmente.",
        },
        {
          title: "Controlla il trend fino all'alba",
          text: "Verifica l'evoluzione di temperatura, vento e umidita per capire se il rischio resta localizzato o si estende al resto del vigneto.",
        },
        {
          title: 'Controlla i germogli dopo la finestra critica',
          text: 'Appena termina la finestra di gelo, verifica i tessuti piu esposti per valutare eventuali danni e le azioni successive.',
        },
      ],
      actionClosingNote: 'Nelle gelate conta arrivare prima della soglia critica: anticipare la protezione riduce il danno ai germogli e limita le perdite di inizio stagione.',
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
