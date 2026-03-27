import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { adminCustomers } from '../data/adminMockData';
import { useAdminDocumentScroll } from './adminAccess';

const alertSeverityWeights = {
  critical: 8,
  high: 4,
  medium: 2,
  low: 1,
};

function formatAverage(value) {
  if (!Number.isFinite(value)) {
    return '0.0';
  }

  return value.toFixed(1);
}

function getAlertPriorityLoad(customer) {
  return (
    customer.criticalAlerts * alertSeverityWeights.critical +
    customer.highAlerts * alertSeverityWeights.high +
    customer.mediumAlerts * alertSeverityWeights.medium +
    customer.lowAlerts * alertSeverityWeights.low
  );
}

function matchesAlertVolume(customer, filterValue) {
  const total = customer.activeAlerts;

  switch (filterValue) {
    case 'zero':
      return total === 0;
    case 'one-two':
      return total >= 1 && total <= 2;
    case 'three-five':
      return total >= 3 && total <= 5;
    case 'six-plus':
      return total >= 6;
    default:
      return true;
  }
}

function compareCustomers(left, right, sortValue) {
  if (sortValue === 'least-alerts') {
    return (
      getAlertPriorityLoad(left) - getAlertPriorityLoad(right) ||
      left.activeAlerts - right.activeAlerts ||
      left.farmerName.localeCompare(right.farmerName)
    );
  }

  if (sortValue === 'name') {
    return left.farmerName.localeCompare(right.farmerName);
  }

  return (
    getAlertPriorityLoad(right) - getAlertPriorityLoad(left) ||
    right.activeAlerts - left.activeAlerts ||
    left.farmerName.localeCompare(right.farmerName)
  );
}

function AdminPage() {
  useAdminDocumentScroll();
  const [searchValue, setSearchValue] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [alertVolumeFilter, setAlertVolumeFilter] = useState('all');
  const [sortValue, setSortValue] = useState('most-alerts');

  const locationOptions = useMemo(
    () =>
      [...new Set(adminCustomers.flatMap((customer) => [customer.locationLabel, customer.region]))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [],
  );

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return [...adminCustomers]
      .filter((customer) => {
        const matchesSearch =
          !normalizedSearch ||
          [customer.farmerName, customer.farmName, customer.locationLabel].some((value) =>
            value.toLowerCase().includes(normalizedSearch),
          );
        const matchesLocation =
          locationFilter === 'all' ||
          customer.locationLabel === locationFilter ||
          customer.region === locationFilter;

        return matchesSearch && matchesLocation && matchesAlertVolume(customer, alertVolumeFilter);
      })
      .sort((left, right) => compareCustomers(left, right, sortValue));
  }, [alertVolumeFilter, locationFilter, searchValue, sortValue]);

  const summaryStats = useMemo(() => {
    const totalCustomers = adminCustomers.length;
    const totalActiveAlerts = adminCustomers.reduce((sum, customer) => sum + customer.activeAlerts, 0);
    const customersWithCriticalAlerts = adminCustomers.filter((customer) => customer.criticalAlerts > 0).length;
    const averageAlerts = totalCustomers > 0 ? totalActiveAlerts / totalCustomers : 0;

    return {
      totalCustomers,
      totalActiveAlerts,
      customersWithCriticalAlerts,
      averageAlerts,
    };
  }, []);

  return (
    <div className="admin-shell">
      <main className="admin-page">
        <PageHeader
          description="Panoramica consorziati per monitorare il carico di allerte, la copertura del servizio e gli account che richiedono un intervento rapido."
          title="Consorzio"
          trailing={
            <div className="admin-header-actions">
              <Link className="admin-button admin-button--ghost" to="/dashboard?mode=roadmap">
                Torna alla roadmap
              </Link>
            </div>
          }
        />

        <section className="admin-stats" aria-label="Riepilogo admin">
          <SectionCard>
            <p className="admin-stat__label">Clienti totali</p>
            <strong className="admin-stat__value">{summaryStats.totalCustomers}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Allerte attive totali</p>
            <strong className="admin-stat__value">{summaryStats.totalActiveAlerts}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Clienti con allerte critiche</p>
            <strong className="admin-stat__value">{summaryStats.customersWithCriticalAlerts}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Media allerte per cliente</p>
            <strong className="admin-stat__value">{formatAverage(summaryStats.averageAlerts)}</strong>
          </SectionCard>
        </section>

        <div className="admin-toolbar-sticky">
          <SectionCard>
            <div className="admin-toolbar">
              <label className="filter-field" htmlFor="admin-search">
                Cerca
                <input
                  className="filter-control"
                  id="admin-search"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Cerca agricoltore, azienda o località"
                  type="search"
                  value={searchValue}
                />
              </label>

              <label className="filter-field" htmlFor="admin-location">
                Località
                <select
                  className="filter-control"
                  id="admin-location"
                  onChange={(event) => setLocationFilter(event.target.value)}
                  value={locationFilter}
                >
                  <option value="all">Tutte le località</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field" htmlFor="admin-alert-volume">
                Numero di allerte
                <select
                  className="filter-control"
                  id="admin-alert-volume"
                  onChange={(event) => setAlertVolumeFilter(event.target.value)}
                  value={alertVolumeFilter}
                >
                  <option value="all">Tutte</option>
                  <option value="zero">0 allerte</option>
                  <option value="one-two">1-2 allerte</option>
                  <option value="three-five">3-5 allerte</option>
                  <option value="six-plus">6+ allerte</option>
                </select>
              </label>

              <label className="filter-field" htmlFor="admin-sort">
                Ordina
                <select
                  className="filter-control"
                  id="admin-sort"
                  onChange={(event) => setSortValue(event.target.value)}
                  value={sortValue}
                >
                  <option value="most-alerts">Più allerte pesate</option>
                  <option value="least-alerts">Meno allerte pesate</option>
                  <option value="name">Nome A-Z</option>
                </select>
              </label>
            </div>
          </SectionCard>
        </div>

        <section className="admin-results">
          <div className="admin-results__header">
            <p className="admin-results__count">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'cliente' : 'clienti'}
            </p>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="admin-grid">
              {filteredCustomers.map((customer) => (
                <Link
                  aria-label={`Apri i dettagli di ${customer.farmerName}`}
                  className="admin-customer-link"
                  key={customer.id}
                  to={`/consorzio/customers/${customer.id}`}
                >
                  <article
                    className={`admin-customer-card${customer.criticalAlerts > 0 ? ' admin-customer-card--critical' : ''}`}
                  >
                    <div className="admin-customer-card__header">
                      <div>
                        <p className="admin-customer-card__name">{customer.farmerName}</p>
                        <h2 className="admin-customer-card__farm">{customer.farmName}</h2>
                      </div>
                      <span className="admin-plan-chip">{customer.servicePlan}</span>
                    </div>

                    <div className="admin-customer-card__meta">
                      <p>{customer.locationLabel}</p>
                      <p>{customer.region}</p>
                      <p>{customer.cropType}</p>
                    </div>

                    <div className="admin-customer-card__metrics">
                      <div>
                        <span>Superficie</span>
                        <strong>{customer.hectares} ha</strong>
                      </div>
                      <div>
                        <span>Appezzamenti</span>
                        <strong>{customer.parcelCount}</strong>
                      </div>
                      <div>
                        <span>Allerte attive</span>
                        <strong>{customer.activeAlerts}</strong>
                      </div>
                    </div>

                    <div className="admin-alert-chip-row">
                      <span className="admin-alert-chip admin-alert-chip--critical">{customer.criticalAlerts} critiche</span>
                      <span className="admin-alert-chip admin-alert-chip--high">{customer.highAlerts} alte</span>
                      <span className="admin-alert-chip admin-alert-chip--medium">{customer.mediumAlerts} medie</span>
                      <span className="admin-alert-chip admin-alert-chip--low">{customer.lowAlerts} basse</span>
                    </div>

                    <div className="admin-customer-card__footer">
                      <div>
                        <span className="admin-customer-card__label">Ultima allerta</span>
                        <p>{customer.lastAlertLabel}</p>
                      </div>
                      <div>
                        <span className="admin-customer-card__label">Stato</span>
                        <p>{customer.status}</p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <SectionCard>
              <div className="admin-empty-state">
                <h2>Nessun cliente corrisponde a questi filtri</h2>
                <p>Prova ad ampliare i filtri per località o numero di allerte, oppure cancella il termine di ricerca.</p>
              </div>
            </SectionCard>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
