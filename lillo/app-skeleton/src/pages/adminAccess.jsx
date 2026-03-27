import React, { useEffect } from 'react';
import SectionCard from '../components/SectionCard';

export const ADMIN_ACCESS_KEY = 'lillo_admin_access';
export const ADMIN_PASSCODE = 'azienda-demo';

export function hasMockAdminAccess() {
  return typeof window !== 'undefined' && window.sessionStorage.getItem(ADMIN_ACCESS_KEY) === 'true';
}

export function useAdminDocumentScroll() {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const root = document.getElementById('root');

    document.documentElement.classList.add('admin-route');
    document.body.classList.add('admin-route');
    root?.classList.add('admin-route');

    return () => {
      document.documentElement.classList.remove('admin-route');
      document.body.classList.remove('admin-route');
      root?.classList.remove('admin-route');
    };
  }, []);
}

function AdminAccessGate({ errorMessage, onPasscodeChange, onSubmit, passcode }) {
  return (
    <div className="admin-shell admin-shell--gate">
      <div className="admin-access">
        <SectionCard>
          <div className="admin-access__card">
            <p className="admin-access__eyebrow">Mock azienda gate</p>
            <h1 className="admin-access__title">Company admin access</h1>
            <p className="admin-access__text">
              This is a mock company-only view for the standalone admin console. It demonstrates frontend access flow only
              and does not provide real authentication security.
            </p>

            <form className="admin-access__form" onSubmit={onSubmit}>
              <label className="filter-field" htmlFor="admin-passcode">
                Passcode
                <input
                  autoComplete="off"
                  className="filter-control admin-access__input"
                  id="admin-passcode"
                  onChange={(event) => onPasscodeChange(event.target.value)}
                  placeholder="Enter the demo passcode"
                  type="password"
                  value={passcode}
                />
              </label>
              {errorMessage ? <p className="admin-access__error">{errorMessage}</p> : null}
              <button className="admin-button admin-button--primary" type="submit">
                Enter admin
              </button>
            </form>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default AdminAccessGate;
