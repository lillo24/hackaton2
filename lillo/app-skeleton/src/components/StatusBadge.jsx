import React from 'react';

const toneClassMap = {
  critical: 'status-badge--critical',
  high: 'status-badge--high',
  medium: 'status-badge--medium',
  low: 'status-badge--low',
  new: 'status-badge--new',
  active: 'status-badge--active',
  monitoring: 'status-badge--monitoring',
  acknowledged: 'status-badge--acknowledged',
  resolved: 'status-badge--resolved',
  live: 'status-badge--live',
  syncing: 'status-badge--syncing',
  degraded: 'status-badge--degraded',
  neutral: 'status-badge--neutral',
};

function StatusBadge({ tone = 'neutral', children }) {
  const toneClass = toneClassMap[tone];

  if (!toneClass) {
    throw new Error(`Badge tone "${tone}" is not supported.`);
  }

  return <span className={`status-badge ${toneClass}`}>{children}</span>;
}

export default StatusBadge;
