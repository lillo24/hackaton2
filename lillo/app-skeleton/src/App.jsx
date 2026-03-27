import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import './components/components.css';
import './pages/pages.css';
import { alertSources, alertTemplates, farmTypes, fields, integrations } from './data/mockData';
import { buildAlertsForFarm } from './data/selectors';
import AppShell from './layout/AppShell';
import AlertDetailPage from './pages/AlertDetailPage';
import AdminCustomerPage from './pages/AdminCustomerPage';
import AdminPage from './pages/AdminPage';
import AlertsPage from './pages/AlertsPage';
import DashboardPage from './pages/DashboardPage';

const DEFAULT_FARM_ID = farmTypes[0].id;

function buildPreviewModeSearch(search) {
  const mode = new URLSearchParams(search).get('mode');
  return mode ? `?mode=${mode}` : '';
}

function LegacyAlertRoute({ alerts, onSelectAlert }) {
  const { alertId } = useParams();
  const location = useLocation();
  const hasAlert = alerts.some((alert) => alert.id === alertId);
  const returnTo = typeof location.state?.from === 'string' ? location.state.from : '/alerts';
  const modeSearch = buildPreviewModeSearch(location.search);

  useEffect(() => {
    onSelectAlert(hasAlert ? alertId : null);
  }, [alertId, hasAlert, onSelectAlert]);

  return (
    <Navigate
      replace
      state={hasAlert ? { from: returnTo, focusAlertId: alertId } : { from: returnTo }}
      to={{ pathname: '/alert', search: modeSearch }}
    />
  );
}

function App() {
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const selectedFarm = farmTypes.find((farm) => farm.id === DEFAULT_FARM_ID);

  if (!selectedFarm) {
    throw new Error(`Farm selection "${DEFAULT_FARM_ID}" is not supported by the mock data set.`);
  }

  const alerts = useMemo(
    () =>
      buildAlertsForFarm({
        farmId: DEFAULT_FARM_ID,
        templates: alertTemplates,
        availableFields: fields,
        availableSources: alertSources,
        availableIntegrations: integrations,
      }),
    [],
  );
  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.id === selectedAlertId) ?? null,
    [alerts, selectedAlertId],
  );

  useEffect(() => {
    if (!selectedAlertId) {
      return;
    }

    const hasSelectedAlert = alerts.some((alert) => alert.id === selectedAlertId);

    if (!hasSelectedAlert) {
      setSelectedAlertId(null);
    }
  }, [alerts, selectedAlertId]);

  return (
    <Routes>
      <Route path="/consorzio" element={<AdminPage />} />
      <Route path="/consorzio/customers/:customerId" element={<AdminCustomerPage />} />
      <Route element={<AppShell selectedFarm={selectedFarm} alerts={alerts} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              alerts={alerts}
              integrations={integrations}
              onSelectAlert={setSelectedAlertId}
              selectedFarm={selectedFarm}
            />
          }
        />
        <Route
          path="/alerts"
          element={
            <AlertsPage
              selectedFarm={selectedFarm}
              alerts={alerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={setSelectedAlertId}
            />
          }
        />
        <Route path="/alert" element={<AlertDetailPage selectedFarm={selectedFarm} alert={selectedAlert} />} />
        <Route path="/alerts/:alertId" element={<LegacyAlertRoute alerts={alerts} onSelectAlert={setSelectedAlertId} />} />
        <Route path="/profile" element={<Navigate replace to="/dashboard" />} />
        <Route path="/farm-type" element={<Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
