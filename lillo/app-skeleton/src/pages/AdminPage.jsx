import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { adminCustomers } from '../data/adminMockData';
import AdminAccessGate, { ADMIN_ACCESS_KEY, ADMIN_PASSCODE, hasMockAdminAccess, useAdminDocumentScroll } from './adminAccess';

function formatAverage(value) {
  if (!Number.isFinite(value)) {
    return '0.0';
  }

  return value.toFixed(1);
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
    return left.activeAlerts - right.activeAlerts || left.farmerName.localeCompare(right.farmerName);
  }

  if (sortValue === 'name') {
    return left.farmerName.localeCompare(right.farmerName);
  }

  return right.activeAlerts - left.activeAlerts || left.farmerName.localeCompare(right.farmerName);
}

function AdminPage() {
  useAdminDocumentScroll();
  const [hasAccess, setHasAccess] = useState(hasMockAdminAccess);
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [alertVolumeFilter, setAlertVolumeFilter] = useState('all');
  const [sortValue, setSortValue] = useState('most-alerts');

  useEffect(() => {
    setHasAccess(hasMockAdminAccess());
  }, []);

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

  function handleGateSubmit(event) {
    event.preventDefault();

    if (passcode !== ADMIN_PASSCODE) {
      setErrorMessage('Use the demo passcode `azienda-demo` to open the mock admin console.');
      return;
    }

    window.sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
    setHasAccess(true);
    setPasscode('');
    setErrorMessage('');
  }

  function handleExitAdmin() {
    window.sessionStorage.removeItem(ADMIN_ACCESS_KEY);
    setHasAccess(false);
    setPasscode('');
    setErrorMessage('');
  }

  if (!hasAccess) {
    return (
      <AdminAccessGate
        errorMessage={errorMessage}
        onPasscodeChange={setPasscode}
        onSubmit={handleGateSubmit}
        passcode={passcode}
      />
    );
  }

  return (
    <div className="admin-shell">
      <main className="admin-page">
        <PageHeader
          description="Azienda-side customer overview for monitoring alert load, service coverage, and accounts that need quick follow-up."
          title="Admin"
          trailing={
            <div className="admin-header-actions">
              <button className="admin-button" onClick={handleExitAdmin} type="button">
                Exit admin
              </button>
              <Link className="admin-button admin-button--ghost" to="/dashboard">
                Back to dashboard
              </Link>
            </div>
          }
        />

        <section className="admin-stats" aria-label="Admin summary">
          <SectionCard>
            <p className="admin-stat__label">Total customers</p>
            <strong className="admin-stat__value">{summaryStats.totalCustomers}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Total active alerts</p>
            <strong className="admin-stat__value">{summaryStats.totalActiveAlerts}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Customers with critical alerts</p>
            <strong className="admin-stat__value">{summaryStats.customersWithCriticalAlerts}</strong>
          </SectionCard>
          <SectionCard>
            <p className="admin-stat__label">Average alerts per customer</p>
            <strong className="admin-stat__value">{formatAverage(summaryStats.averageAlerts)}</strong>
          </SectionCard>
        </section>

        <SectionCard>
          <div className="admin-toolbar">
            <label className="filter-field" htmlFor="admin-search">
              Search
              <input
                className="filter-control"
                id="admin-search"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search farmer, farm, or location"
                type="search"
                value={searchValue}
              />
            </label>

            <label className="filter-field" htmlFor="admin-location">
              Location
              <select
                className="filter-control"
                id="admin-location"
                onChange={(event) => setLocationFilter(event.target.value)}
                value={locationFilter}
              >
                <option value="all">All locations</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field" htmlFor="admin-alert-volume">
              Alert volume
              <select
                className="filter-control"
                id="admin-alert-volume"
                onChange={(event) => setAlertVolumeFilter(event.target.value)}
                value={alertVolumeFilter}
              >
                <option value="all">All</option>
                <option value="zero">0 alerts</option>
                <option value="one-two">1-2 alerts</option>
                <option value="three-five">3-5 alerts</option>
                <option value="six-plus">6+ alerts</option>
              </select>
            </label>

            <label className="filter-field" htmlFor="admin-sort">
              Sort
              <select
                className="filter-control"
                id="admin-sort"
                onChange={(event) => setSortValue(event.target.value)}
                value={sortValue}
              >
                <option value="most-alerts">Most alerts</option>
                <option value="least-alerts">Least alerts</option>
                <option value="name">Name A-Z</option>
              </select>
            </label>
          </div>
        </SectionCard>

        <section className="admin-results">
          <div className="admin-results__header">
            <p className="admin-results__count">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
            </p>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="admin-grid">
              {filteredCustomers.map((customer) => (
                <Link
                  aria-label={`Open ${customer.farmerName} details`}
                  className="admin-customer-link"
                  key={customer.id}
                  to={`/admin/customers/${customer.id}`}
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
                        <span>Surface</span>
                        <strong>{customer.hectares} ha</strong>
                      </div>
                      <div>
                        <span>Parcels</span>
                        <strong>{customer.parcelCount}</strong>
                      </div>
                      <div>
                        <span>Active alerts</span>
                        <strong>{customer.activeAlerts}</strong>
                      </div>
                    </div>

                    <div className="admin-alert-chip-row">
                      <span className="admin-alert-chip admin-alert-chip--critical">{customer.criticalAlerts} critical</span>
                      <span className="admin-alert-chip admin-alert-chip--high">{customer.highAlerts} high</span>
                      <span className="admin-alert-chip admin-alert-chip--medium">{customer.mediumAlerts} medium</span>
                      <span className="admin-alert-chip admin-alert-chip--low">{customer.lowAlerts} low</span>
                    </div>

                    <div className="admin-customer-card__footer">
                      <div>
                        <span className="admin-customer-card__label">Last alert</span>
                        <p>{customer.lastAlertLabel}</p>
                      </div>
                      <div>
                        <span className="admin-customer-card__label">Status</span>
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
                <h2>No customers match these filters</h2>
                <p>Try broadening the location or alert-volume filters, or clear the search term.</p>
              </div>
            </SectionCard>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
