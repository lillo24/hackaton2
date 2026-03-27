import { alertSources, fields, integrations } from './mockData';

const severityPriority = { critical: 4, high: 3, medium: 2, low: 1 };
const statusPriority = { new: 5, active: 4, monitoring: 3, acknowledged: 2, resolved: 1 };
const relevancePriority = { primary: 3, supporting: 2, background: 1 };

function toMapById(records, entityName) {
  const map = new Map();

  records.forEach((record) => {
    if (!record?.id) {
      throw new Error(`${entityName} entry is missing the required "id" field.`);
    }

    if (map.has(record.id)) {
      throw new Error(`${entityName} has duplicate id "${record.id}".`);
    }

    map.set(record.id, record);
  });

  return map;
}

function readFarmCopy(record, farmId, alertId, fieldName) {
  const value = record?.[farmId];

  if (!value) {
    throw new Error(`Alert "${alertId}" is missing ${fieldName} copy for farm "${farmId}".`);
  }

  return value;
}

function readSourceContribution(template, sourceId) {
  const contribution = template.sourceContributions?.[sourceId];

  if (!contribution?.signal || !contribution?.interpretation) {
    throw new Error(`Alert "${template.id}" is missing source contribution details for "${sourceId}".`);
  }

  return contribution;
}

function minutesAgoLabel(minutesAgo) {
  if (minutesAgo < 0) {
    throw new Error(`Time cannot be negative (received ${minutesAgo}).`);
  }

  if (minutesAgo < 60) {
    return `${minutesAgo} min fa`;
  }

  const hours = Math.floor(minutesAgo / 60);
  const remainingMinutes = minutesAgo % 60;

  if (remainingMinutes === 0) {
    return `${hours} h fa`;
  }

  return `${hours} h ${remainingMinutes} min fa`;
}

function minutesAgoClock(minutesAgo) {
  const date = new Date(Date.now() - minutesAgo * 60_000);

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function unique(items) {
  return Array.from(new Set(items));
}

function confidenceLabel({ severity, sourceCount }) {
  if (severity === 'critical' || sourceCount >= 3) {
    return 'High confidence';
  }

  if (severity === 'high' || sourceCount === 2) {
    return 'Moderate confidence';
  }

  return 'Watch confidence';
}

export function buildAlertsForFarm({
  farmId,
  templates,
  availableFields = fields,
  availableSources = alertSources,
  availableIntegrations = integrations,
}) {
  const fieldById = toMapById(availableFields, 'Field');
  const sourceById = toMapById(availableSources, 'Alert source');
  const integrationById = toMapById(availableIntegrations, 'Integration');

  return templates
    .filter((template) => Boolean(template.farmRelevance?.[farmId]))
    .map((template) => {
      const fieldId = template.fieldByFarm?.[farmId];
      const field = fieldById.get(fieldId);

      if (!field) {
        throw new Error(`Alert "${template.id}" references unknown field "${fieldId}" for farm "${farmId}".`);
      }

      const sourceObjects = template.sourceIds.map((sourceId) => {
        const source = sourceById.get(sourceId);

        if (!source) {
          throw new Error(`Alert "${template.id}" references unknown source "${sourceId}".`);
        }

        const contribution = readSourceContribution(template, sourceId);

        return {
          ...source,
          signal: contribution.signal,
          interpretation: contribution.interpretation,
        };
      });

      const relatedIntegrationIds = unique(sourceObjects.flatMap((source) => source.integrationIds));
      const relatedIntegrations = relatedIntegrationIds.map((integrationId) => {
        const integration = integrationById.get(integrationId);

        if (!integration) {
          throw new Error(`Alert "${template.id}" references unknown integration "${integrationId}" via source linkage.`);
        }

        return integration;
      });

      const timeline = template.timeline
        .slice()
        .sort((left, right) => right.minutesAgo - left.minutesAgo)
        .map((entry) => ({
          ...entry,
          time: minutesAgoClock(entry.minutesAgo),
          recency: minutesAgoLabel(entry.minutesAgo),
        }));

      const farmRelevance = template.farmRelevance[farmId];
      const sourceSignalCount = sourceObjects.length;
      const linkedFeedCount = relatedIntegrations.length;
      const timestampIso = new Date(Date.now() - template.occurredMinutesAgo * 60_000).toISOString();

      return {
        id: template.id,
        severity: template.severity,
        status: template.status,
        farmRelevance,
        relevanceReason: readFarmCopy(template.relevanceReasons, farmId, template.id, 'relevance reason'),
        title: readFarmCopy(template.titles, farmId, template.id, 'title'),
        summary: readFarmCopy(template.summaries, farmId, template.id, 'summary'),
        whyTriggered: readFarmCopy(template.reasons, farmId, template.id, 'reason'),
        suggestedAction: readFarmCopy(template.actions, farmId, template.id, 'action'),
        confidenceLabel: confidenceLabel({ severity: template.severity, sourceCount: sourceSignalCount }),
        sourceSignalCount,
        linkedFeedCount,
        provenanceSummary: `Based on ${sourceSignalCount} corroborated signal${
          sourceSignalCount === 1 ? '' : 's'
        } across ${linkedFeedCount} connected data feed${linkedFeedCount === 1 ? '' : 's'}.`,
        sourceIds: template.sourceIds,
        sources: sourceObjects,
        sourceNames: sourceObjects.map((source) => source.label),
        fieldId,
        field,
        timestampMinutesAgo: template.occurredMinutesAgo,
        timestampLabel: minutesAgoLabel(template.occurredMinutesAgo),
        timestampIso,
        timeline,
        relatedIntegrationIds,
        relatedIntegrations,
      };
    })
    .sort((left, right) => {
      const relevanceDelta = relevancePriority[right.farmRelevance] - relevancePriority[left.farmRelevance];
      if (relevanceDelta !== 0) {
        return relevanceDelta;
      }

      const severityDelta = severityPriority[right.severity] - severityPriority[left.severity];
      if (severityDelta !== 0) {
        return severityDelta;
      }

      const statusDelta = statusPriority[right.status] - statusPriority[left.status];
      if (statusDelta !== 0) {
        return statusDelta;
      }

      if (left.timestampMinutesAgo !== right.timestampMinutesAgo) {
        return left.timestampMinutesAgo - right.timestampMinutesAgo;
      }

      return left.title.localeCompare(right.title);
    });
}
