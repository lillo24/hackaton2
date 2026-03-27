import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmProfileStage from '../components/FarmProfileStage';
import SectionCard from '../components/SectionCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import WaterLevelCard from '../components/WaterLevelCard';

const dashboardWarningTileIds = ['tile-2', 'tile-4'];
const dashboardProfileName = 'Giorgio';
const dashboardProfileTitle = `L'azienda di ${dashboardProfileName}`;
const localizedAssistantFieldPhrases = {
  'North Canopy Block': {
    subject: 'la parcella nord del vigneto',
    location: 'nella parcella nord del vigneto',
  },
  'Terrazza inferiore': {
    subject: 'la terrazza inferiore',
    location: 'nella terrazza inferiore',
  },
};

function withPeriod(text) {
  const clean = (text ?? '').trim();

  if (!clean) {
    return '';
  }

  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function formatSeverityBreakdown(severityCounts) {
  const parts = [
    severityCounts.critical ? `${severityCounts.critical} critic${severityCounts.critical === 1 ? 'a' : 'he'}` : null,
    severityCounts.high ? `${severityCounts.high} alt${severityCounts.high === 1 ? 'a' : 'e'}` : null,
    severityCounts.medium ? `${severityCounts.medium} medi${severityCounts.medium === 1 ? 'a' : 'e'}` : null,
    severityCounts.low ? `${severityCounts.low} bass${severityCounts.low === 1 ? 'a' : 'e'}` : null,
  ].filter(Boolean);

  if (!parts.length) {
    return 'nessuna criticita attiva';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[0]} e ${parts[1]}`;
  }

  return `${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}`;
}

function getLocalizedAssistantFieldPhrase(fieldName, context) {
  const normalizedFieldName = (fieldName ?? '').trim();
  const localizedPhrase = localizedAssistantFieldPhrases[normalizedFieldName];

  if (localizedPhrase) {
    return localizedPhrase[context];
  }

  if (context === 'location') {
    return normalizedFieldName ? `in ${normalizedFieldName}` : 'in un secondo blocco operativo';
  }

  return normalizedFieldName || 'il blocco prioritario';
}

function buildDailyAssistantReply({
  profileName,
  totalAlerts,
  severityCounts,
  leadAlert,
  secondaryAlert,
}) {
  const alertBreakdown = formatSeverityBreakdown(severityCounts);
  const leadArea = getLocalizedAssistantFieldPhrase(leadAlert?.field?.name, 'subject');
  const secondaryArea = getLocalizedAssistantFieldPhrase(secondaryAlert?.field?.name, 'location');
  const leadSummary = leadAlert ? `La priorita piu urgente riguarda ${leadArea}.` : 'Non risultano anomalie attive.';
  const secondarySummary = secondaryAlert
    ? `C'e anche un secondo segnale da monitorare ${secondaryArea}.`
    : 'Non ci sono altre escalation immediate.';

  return `Buongiorno ${profileName}. La tua azienda registra ${totalAlerts} ${totalAlerts === 1 ? 'segnalazione attiva' : 'segnalazioni attive'}: ${alertBreakdown}. ${leadSummary} ${secondarySummary}`.trim();
}

function buildFollowupAssistantReply({
  prompt,
  profileName,
  totalAlerts,
  severityCounts,
}) {
  return `Ricevuto: ${withPeriod(prompt)} ${profileName}, al momento la tua azienda ha ${totalAlerts} ${totalAlerts === 1 ? 'segnalazione attiva' : 'segnalazioni attive'}: ${formatSeverityBreakdown(severityCounts)}. Se vuoi, posso sintetizzare cause, impatto o prossime azioni.`;
}

function buildDashboardTileAlertAssignments(alerts) {
  // Temporary placeholder mapping until each warning tile is connected to a specific alert owner.
  return dashboardWarningTileIds
    .map((tileId, index) => {
      const alert = alerts[index] ?? alerts[0] ?? null;

      if (!alert) {
        return null;
      }

      return {
        tileId,
        alertId: alert.id,
        buttonLabel: `Apri dettaglio segnalazione: ${alert.title}`,
      };
    })
    .filter(Boolean);
}

function buildDashboardTileTerrainTreatments() {
  return [
    // Keep the warm reference texture on the left parcel while top/bottom fall back to plain green tiles.
    { tileId: 'tile-2', problem: 'frozen', variant: 'frost', tone: 'problem' },
    { tileId: 'tile-4', problem: 'fungus', variant: 'relief', tone: 'preview' },
  ];
}

function DashboardPage({ selectedFarm, alerts = [], integrations = [], onSelectAlert }) {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const typingIntervalRef = useRef(null);
  const nextMessageIdRef = useRef(1);
  const scopedFields = useMemo(() => {
    const uniqueFields = new Map();

    alerts.forEach((alert) => {
      uniqueFields.set(alert.field.id, alert.field);
    });

    return Array.from(uniqueFields.values()).sort((left, right) => left.name.localeCompare(right.name));
  }, [alerts]);
  const primaryAlerts = useMemo(() => alerts.filter((alert) => alert.farmRelevance === 'primary').length, [alerts]);
  const severityCounts = useMemo(
    () =>
      alerts.reduce(
        (counts, alert) => {
          if (alert.severity in counts) {
            counts[alert.severity] += 1;
          }

          return counts;
        },
        { critical: 0, high: 0, medium: 0, low: 0 },
      ),
    [alerts],
  );
  const totalAlerts = alerts.length;
  const severityPills = useMemo(
    () =>
      [
        {
          key: 'critical',
          tone: 'critical',
          count: severityCounts.critical,
          label: `${severityCounts.critical} critic${severityCounts.critical === 1 ? 'a' : 'he'}`,
        },
        {
          key: 'medium',
          tone: 'medium',
          count: severityCounts.medium,
          label: `${severityCounts.medium} medi${severityCounts.medium === 1 ? 'a' : 'e'}`,
        },
      ].filter((pill) => pill.count > 0),
    [severityCounts.critical, severityCounts.medium],
  );
  const waterTrend = useMemo(() => {
    const labels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const baseline = [49, 47, 50, 56, 61, 58, 60];
    const adjustment = Math.min(6, primaryAlerts);

    return labels.map((label, index) => ({
      label,
      value: baseline[index] + adjustment,
    }));
  }, [primaryAlerts]);
  const moistureColumns = useMemo(
    () => [
      { id: 'north-block', label: scopedFields[0]?.plotCode ?? 'Parcella A', value: 64 },
      { id: 'lower-block', label: scopedFields[1]?.plotCode ?? 'Parcella B', value: 57 },
      { id: 'target', label: 'Obiettivo', value: 68 },
    ],
    [scopedFields],
  );
  const dailyAssistantReply = useMemo(
    () =>
      buildDailyAssistantReply({
        profileName: dashboardProfileName,
        totalAlerts,
        severityCounts,
        leadAlert: alerts[0],
        secondaryAlert: alerts[1],
      }),
    [alerts, severityCounts, totalAlerts],
  );
  const tileAlertAssignments = useMemo(() => buildDashboardTileAlertAssignments(alerts), [alerts]);
  const tileTerrainTreatments = useMemo(() => buildDashboardTileTerrainTreatments(), []);

  function stopTyping() {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }

  function streamAssistantMessage(fullText, typingDelay = 30) {
    stopTyping();

    const messageId = nextMessageIdRef.current++;
    let characterIndex = 0;

    setTypingMessageId(messageId);
    setChatMessages((previousMessages) => [
      ...previousMessages,
      { id: messageId, role: 'assistant', text: '' },
    ]);

    typingIntervalRef.current = setInterval(() => {
      characterIndex += 1;
      setChatMessages((previousMessages) =>
        previousMessages.map((message) =>
          message.id === messageId ? { ...message, text: fullText.slice(0, characterIndex) } : message,
        ),
      );

      if (characterIndex >= fullText.length) {
        stopTyping();
        setTypingMessageId(null);
      }
    }, typingDelay);
  }

  useEffect(() => {
    setChatMessages([]);
    streamAssistantMessage(dailyAssistantReply, 34);

    return () => stopTyping();
  }, [dailyAssistantReply]);

  function handleSendMessage(event) {
    event.preventDefault();
    const prompt = chatInput.trim();

    if (!prompt) {
      return;
    }

    const userMessageId = nextMessageIdRef.current++;
    const followupReply = buildFollowupAssistantReply({
      prompt,
      profileName: dashboardProfileName,
      totalAlerts,
      severityCounts,
    });

    setChatMessages((previousMessages) => [
      ...previousMessages,
      { id: userMessageId, role: 'user', text: prompt },
    ]);
    setChatInput('');
    streamAssistantMessage(followupReply, 26);
  }

  function handleOpenTileAlert(alertId) {
    if (!alertId) {
      return;
    }

    onSelectAlert?.(alertId);
    navigate(`/alerts/${alertId}`, {
      state: { focusAlertId: alertId, from: '/dashboard' },
    });
  }

  return (
    <div className="page dashboard-page">
      <FarmProfileStage
        alertSummaryItems={severityPills}
        alerts={alerts}
        className="dashboard-profile-stage"
        integrations={integrations}
        onOpenTileAlert={handleOpenTileAlert}
        selectedFarm={selectedFarm}
        tileAlertAssignments={tileAlertAssignments}
        tileTerrainTreatments={tileTerrainTreatments}
        title={dashboardProfileTitle}
      />

      <div className="dashboard-priority-grid">
        <div className="dashboard-priority-grid__assistant">
          <SectionCard>
            <div className="dashboard-assistant">
              <div aria-live="polite" className="dashboard-assistant-chat">
                <header className="dashboard-assistant-chat__header">
                  <div className="dashboard-assistant-chat__hero">
                    <div className="dashboard-assistant-chat__avatar" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2Z" />
                      </svg>
                    </div>
                    <div className="dashboard-assistant-chat__identity">
                      <p className="dashboard-assistant-chat__name">Assistente agricolo</p>
                    </div>
                  </div>
                </header>

                <div className="dashboard-assistant-chat__messages">
                  {chatMessages.map((message) => (
                    <article
                      className={`dashboard-assistant-chat__bubble dashboard-assistant-chat__bubble--${message.role}`}
                      key={message.id}
                    >
                      <p>
                        {message.text}
                        {typingMessageId === message.id ? <span aria-hidden="true" className="dashboard-assistant__cursor">|</span> : null}
                      </p>
                    </article>
                  ))}
                </div>

                <form className="dashboard-assistant-chat__composer" onSubmit={handleSendMessage}>
                  <input
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Chiedi priorita, cause o azioni"
                    type="text"
                    value={chatInput}
                  />
                  <button
                    aria-label="Invia messaggio"
                    type="submit"
                  >
                    <svg viewBox="0 0 24 24">
                      <line x1="22" x2="11" y1="2" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="dashboard-summary-grid">
        <WaterLevelCard points={waterTrend} />
        <SoilMoistureCard columns={moistureColumns} />
      </div>
    </div>
  );
}

export default DashboardPage;
