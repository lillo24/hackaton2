Lavora nel repo `lillo/app-skeleton`.

Obiettivo:
tradurre TUTTA la sezione admin in italiano corretto, naturale e grammaticalmente pulito, senza rompere la logica esistente.

Importante:
- Traduci solo il testo visibile all’utente e gli `aria-label`.
- NON cambiare route, className, nomi variabili, chiavi oggetto, id, enum tecnici, import/export.
- NON tradurre i valori tecnici usati dalla logica, per esempio:
  - `alert.status`: `new`, `monitoring`, `resolved`, ecc. devono restare così
  - `severity`: `critical`, `high`, `medium`, `low` devono restare così come valori macchina
- Mantieni invariato il comportamento della pagina.
- L’italiano deve essere idiomatico e coerente con una dashboard agricola professionale.

File da modificare:
1. `src/pages/AdminPage.jsx`
2. `src/pages/AdminCustomerPage.jsx`
3. `src/data/adminMockData.js`
4. `src/components/AlertDetailBlock.jsx` SOLO se serve per eliminare testo inglese o correggere italiano scorretto che compare nella vista admin

Cosa fare nel dettaglio:

### 1) `src/pages/AdminPage.jsx`
Traduci tutte le stringhe utente:
- titolo e descrizione header
- bottone `Back to roadmap`
- statistiche:
  - `Total customers`
  - `Total active alerts`
  - `Customers with critical alerts`
  - `Average alerts per customer`
- toolbar filtri:
  - `Search`
  - placeholder `Search farmer, farm, or location`
  - `Location`
  - `All locations`
  - `Alert volume`
  - `All`
  - `0 alerts`
  - `1-2 alerts`
  - `3-5 alerts`
  - `6+ alerts`
  - `Sort`
  - `Most alerts`
  - `Least alerts`
  - `Name A-Z`
- conteggio risultati:
  - `customer/customers`
- card cliente:
  - `Surface`
  - `Parcels`
  - `Active alerts`
  - `Last alert`
  - `Status`
  - chip `critical / high / medium / low`
- empty state:
  - `No customers match these filters`
  - testo descrittivo
- `aria-label` come `Open ... details`
- usa un italiano naturale, per esempio:
  - `Clienti totali`
  - `Allerte attive totali`
  - `Clienti con allerte critiche`
  - `Media allerte per cliente`
  - `Cerca`
  - `Località`
  - `Numero di allerte`
  - `Ordina`
  - `Più allerte`
  - `Meno allerte`
  - `Superficie`
  - `Appezzamenti`
  - `Ultima allerta`
  - `Stato`

### 2) `src/pages/AdminCustomerPage.jsx`
Traduci tutto il testo utente e correggi le funzioni helper dove serve:
- `formatAlertTime`:
  - `min ago` -> `min fa`
  - `h ago` -> `h fa` oppure meglio `ore fa` se il codice lo consente pulitamente
  - `Recent` -> `Recente`
- `formatSeverityLabel`:
  - non deve più restituire `Critical`, `High`, ecc.
  - deve restituire `Critico`, `Alto`, `Medio`, `Basso`
- fallback stringhe in `buildFallbackSources` e `normalizeAdminAlert`:
  - tutte in italiano
- stato “customer not found”:
  - `Customer not found`
  - testo descrittivo
  - `Back to admin`
- header cliente:
  - descrizione in italiano
- hero:
  - `Customer profile`
  - `Customer overview`
  - `Location`
  - `Region`
  - `Crop type`
  - `Surface`
  - `Parcels`
  - `Status`
- statistiche:
  - `Total alerts`
  - `Critical`
  - `High`
  - `Medium`
  - `Low`
- listing allerte:
  - `Customer alerts`
  - conteggio `active/resolved alert(s)`
  - toggle `Active` / `Resolved`
  - `aria-label="Filter customer alerts by status"`
- empty state:
  - `No active alerts`
  - `No resolved alerts`
  - testi descrittivi
- `aria-label` e altri testi accessibili devono essere anch’essi in italiano

### 3) `src/data/adminMockData.js`
Traduci TUTTI i contenuti visibili all’utente presenti nei mock dati, mantenendo intatta la struttura dati.

Traduci:
- `cropType`
- `customer.status` se visibile
- `lastAlertLabel`
- `alert.title`
- `fieldName`
- `sourceSummary`
- `summary`
- `recommendedAction`
- `timestampLabel` tipo `Today, 07:55` -> `Oggi, 07:55`
- eventuali altri testi utente

NON tradurre:
- `alert.status` tecnici (`new`, `monitoring`, `resolved`, ecc.)
- `severity`
- `id`

Attenzione:
- le frasi devono suonare bene in italiano, non letterali
- niente inglesismi inutili
- lessico coerente con vigneti, appezzamenti, monitoraggio, rischio, sensori, meteo

### 4) `src/components/AlertDetailBlock.jsx`
Modifica questo file solo se nella vista admin restano stringhe non italiane o italiane scorrette.
Correzioni desiderate se presenti:
- `Perche pensiamo sia il problema` -> `Perché pensiamo che questo sia il problema`
- eventuali `aria-label` tipo `detail` -> `dettagli`
- controlla accenti e grammatica

### Vincoli di qualità
- Italiano corretto, con accenti giusti: `Perché`, `più`, `all’admin`, ecc.
- Tono professionale e chiaro
- Nessun cambiamento strutturale non necessario
- Nessuna regressione logica

### Verifica finale
Dopo le modifiche:
1. esegui una ricerca nei file coinvolti per trovare testo inglese residuo visibile all’utente
2. correggi quello che rimane
3. esegui il build finale

Comandi finali:
- cerca stringhe residue in inglese nei file toccati
- `npm run build`

Poi mostrami:
- elenco file modificati
- breve riassunto delle traduzioni/fix fatti
- eventuali stringhe lasciate in inglese solo se deliberate e motivate