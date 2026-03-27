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
      kicker: 'Possible Peronospora onset identified from integrated field data',
      title: 'Peronospora risk',
      severityTone: 'high',
      severityLabel: 'High',
      summary: 'Field conditions match a Peronospora infection window.',
      plantLabel: 'Peronospora',
      evidenceTitle: 'Why this alert was triggered',
      evidenceItems: [
        'Rain event detected',
        'Leaf wetness remained elevated',
        'Humidity stayed high',
        'Temperature stayed in the infection-favorable range',
      ],
      detectedPatternTitle: 'Detected pattern',
      detectedPatternText:
        'After rainfall, the canopy stayed wet for several hours while humidity remained high and temperature stayed in a favorable range for Peronospora development. These signals, taken together, indicate a strong probability of infection risk in this block.',
      dataUsedTitle: 'Data used',
      dataItems: [
        {
          label: 'Weather',
          description: 'recent rain and forecast humidity',
        },
        {
          label: 'Air sensor',
          description: 'temperature and relative humidity',
        },
        {
          label: 'Leaf wetness / canopy condition',
          description: 'prolonged wet surface',
        },
        {
          label: 'Field context',
          description: 'crop type and block-specific susceptibility',
        },
      ],
      actionTitle: 'Recommended action',
      actionItems: [
        'Inspect the most exposed leaves for early symptoms',
        'Prioritize this vineyard block in the next field check',
        'Evaluate treatment timing based on agronomic protocol',
        'Monitor the next 24-48 hours for continued favorable conditions',
      ],
      noteTitle: 'Why acting now matters',
      noteText: 'Early intervention can reduce spread risk and avoid a more severe infection stage.',
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
        <span>New notification</span>
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
