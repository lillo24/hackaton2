You are working in the lillo repo.

Goal:
1. change the customer sorting on the consorzio page so that it is NOT based only on raw alert count
2. make the sorting severity-weighted
3. rename the visible "admin" experience to "consorzio"
4. change the routes from /admin to /consorzio
5. keep CSS class names / file names as they are unless strictly needed, to avoid breaking styles

Implement exactly this.

-----------------------------------
1) In src/pages/AdminPage.jsx
-----------------------------------

Add a severity weight map near the top:

const alertSeverityWeights = {
  critical: 8,
  high: 4,
  medium: 2,
  low: 1,
};

Add a helper:

function getAlertPriorityLoad(customer) {
  return (
    customer.criticalAlerts * alertSeverityWeights.critical +
    customer.highAlerts * alertSeverityWeights.high +
    customer.mediumAlerts * alertSeverityWeights.medium +
    customer.lowAlerts * alertSeverityWeights.low
  );
}

Update compareCustomers so that:
- "most-alerts" sorts by weighted severity load descending
- "least-alerts" sorts by weighted severity load ascending
- raw activeAlerts is only a tie-breaker
- farmerName remains the final tie-breaker

Use this exact logic:

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

Also in the same file:
- change PageHeader title from "Admin" to "Consorzio"
- update the description so it says "consorziati" instead of admin/clienti language where appropriate
- change the results links from:
  to={`/admin/customers/${customer.id}`}
  to:
  to={`/consorzio/customers/${customer.id}`}

Change the sort option labels from:
- "Più allerte" / "Meno allerte"
to:
- "Più allerte pesate"
- "Meno allerte pesate"

-----------------------------------
2) In src/App.jsx
-----------------------------------

Change the routes:

from:
<Route path="/admin" element={<AdminPage />} />
<Route path="/admin/customers/:customerId" element={<AdminCustomerPage />} />

to:
<Route path="/consorzio" element={<AdminPage />} />
<Route path="/consorzio/customers/:customerId" element={<AdminCustomerPage />} />

-----------------------------------
3) In src/layout/AppShell.jsx
-----------------------------------

Change the utility link:

from:
<Link className="app-shell__utility-link app-shell__utility-link--admin" to="/admin">
  Pagina admin
</Link>

to:
<Link className="app-shell__utility-link app-shell__utility-link--admin" to="/consorzio">
  Pagina consorzio
</Link>

Keep the CSS class name as app-shell__utility-link--admin so styles do not break.

-----------------------------------
4) In src/pages/AdminCustomerPage.jsx
-----------------------------------

Change visible text and back links from admin to consorzio.

Examples:
- "Cliente admin" -> "Cliente consorzio"
- "Torna all'admin" -> "Torna al consorzio"
- references to "dati mock dell'admin" -> "dati mock del consorzio"

Change links:
from /admin
to /consorzio

So:

<Link ... to="/admin">
becomes
<Link ... to="/consorzio">

Do this for all back buttons in this file.

-----------------------------------
5) Do NOT do these unless necessary
-----------------------------------

- do not rename component names like AdminPage/AdminCustomerPage
- do not rename CSS files like admin.css
- do not rename CSS classes starting with admin-
- do not redesign the UI

-----------------------------------
6) Validation
-----------------------------------

After editing:
- search for any remaining hardcoded route strings "/admin" in src and replace app-facing ones with "/consorzio"
- make sure the consorzio page still opens
- make sure customer detail pages still open
- make sure sorting by "Più allerte pesate" really prioritizes critical/high mixes over many low alerts

Then output a short summary of changed files.