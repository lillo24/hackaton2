export const alertSeverityScale = ['critical', 'high', 'medium', 'low'];
export const alertStatusScale = ['new', 'active', 'monitoring', 'acknowledged', 'resolved'];
export const farmRelevanceScale = ['primary', 'supporting', 'background'];

export const farmTypes = [
  {
    id: 'vineyard',
    label: 'Vineyard',
    code: 'VN',
    description: 'Humidity swings, mildew pressure, and spray timing are the dominant operators here.',
    traits: ['Slope blocks', 'Leaf wetness', 'Spray window'],
    cropType: 'Wine grapes',
    soilType: 'Calcareous loam',
    plotBlocks: 2,
    irrigationProfile: 'Drip lines',
    monitoringMode: 'Microclimate watch',
    primarySignal: 'Canopy humidity drift',
    operatingFocus: 'Protect clusters before damp air turns into a disease window.',
    integrationNote: 'Vineyard mode prioritizes microclimate sensors and short weather windows for spray timing.',
  },
  {
    id: 'orchard',
    label: 'Orchard',
    code: 'OR',
    description: 'Tree-row airflow, blossom sensitivity, and irrigation consistency drive the alert stack.',
    traits: ['Tree canopy', 'Frost pockets', 'Fruit stress'],
    cropType: 'Stone fruit trees',
    soilType: 'Sandy loam',
    plotBlocks: 2,
    irrigationProfile: 'Micro-sprinkler',
    monitoringMode: 'Canopy balance',
    primarySignal: 'Canopy temperature spread',
    operatingFocus: 'Keep fruit stress low while reacting early to cold pockets and wet leaf conditions.',
    integrationNote: 'Orchard mode leans on canopy sensors, frost modeling, and crew scheduling handoffs.',
  },
  {
    id: 'open-field',
    label: 'Open Field',
    code: 'OF',
    description: 'Large exposed plots need wind-aware spraying, irrigation discipline, and broad condition cues.',
    traits: ['Wind shifts', 'Soil drift', 'Wide coverage'],
    cropType: 'Cereal rotation',
    soilType: 'Silty loam',
    plotBlocks: 2,
    irrigationProfile: 'Pivot + drip hybrid',
    monitoringMode: 'Zone variance',
    primarySignal: 'Moisture variance by zone',
    operatingFocus: 'Stabilize broad-field conditions before wind and soil drift spread the issue.',
    integrationNote: 'Open-field mode emphasizes satellite coverage, weather models, and zone-level irrigation checks.',
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse',
    code: 'GH',
    description: 'Closed-loop environments amplify condensation, ventilation imbalance, and nutrient drift.',
    traits: ['Ventilation', 'Condensation', 'Nutrient mixing'],
    cropType: 'Leafy greens',
    soilType: 'Substrate mix',
    plotBlocks: 2,
    irrigationProfile: 'Nutrient recirculation',
    monitoringMode: 'Climate control',
    primarySignal: 'Ventilation and humidity balance',
    operatingFocus: 'Keep the environment stable before condensation and nutrient drift reduce yield quality.',
    integrationNote: 'Greenhouse mode pushes indoor climate sensors and control-system sync health to the front.',
  },
];

export const fields = [
  {
    id: 'vineyard-north-canopy',
    farmTypeId: 'vineyard',
    name: 'North Canopy Block',
    plotCode: 'VN-N1',
    description: 'North-facing slope rows with tighter airflow and high mildew sensitivity.',
  },
  {
    id: 'vineyard-lower-terrace',
    farmTypeId: 'vineyard',
    name: 'Lower Terrace',
    plotCode: 'VN-L3',
    description: 'Cool air settles here first, making this block the frost watchpoint.',
  },
  {
    id: 'orchard-central-rows',
    farmTypeId: 'orchard',
    name: 'Central Orchard Rows',
    plotCode: 'OR-C2',
    description: 'Stone-fruit rows where wet-leaf persistence usually appears first.',
  },
  {
    id: 'orchard-blossom-lane',
    farmTypeId: 'orchard',
    name: 'Blossom Lane',
    plotCode: 'OR-B1',
    description: 'Blossom-sensitive row set with early cold-pool exposure.',
  },
  {
    id: 'openfield-west-zones',
    farmTypeId: 'open-field',
    name: 'West Zone Cluster',
    plotCode: 'OF-W4',
    description: 'Wide exposed section where irrigation drift and wind shifts stack quickly.',
  },
  {
    id: 'openfield-central-band',
    farmTypeId: 'open-field',
    name: 'Central Stress Band',
    plotCode: 'OF-C7',
    description: 'Satellite stress band that requires repeat moisture checks.',
  },
  {
    id: 'greenhouse-bay-2',
    farmTypeId: 'greenhouse',
    name: 'Greenhouse Bay 2',
    plotCode: 'GH-B2',
    description: 'Nutrient feed zone with dense crop load and short response windows.',
  },
  {
    id: 'greenhouse-seedling-corridor',
    farmTypeId: 'greenhouse',
    name: 'Seedling Corridor',
    plotCode: 'GH-S1',
    description: 'Ventilation-sensitive corridor where condensation and heat lag emerge first.',
  },
];

export const alertSources = [
  {
    id: 'weather-model',
    label: 'Weather Forecast Fusion',
    description: 'Short-horizon weather, wind, and temperature trend signal.',
    integrationIds: ['weather-api'],
  },
  {
    id: 'canopy-sensor-network',
    label: 'Canopy Sensor Network',
    description: 'Leaf wetness, canopy humidity, and in-row temperature telemetry.',
    integrationIds: ['iot-sensors'],
  },
  {
    id: 'soil-probe-grid',
    label: 'Soil Probe Grid',
    description: 'Moisture and post-irrigation recovery checks by zone.',
    integrationIds: ['iot-sensors'],
  },
  {
    id: 'irrigation-controller',
    label: 'Irrigation Controller',
    description: 'Valve timing and nutrient dosing control logs.',
    integrationIds: ['iot-sensors', 'farm-management'],
  },
  {
    id: 'satellite-observation',
    label: 'Satellite Observation',
    description: 'Vegetation and thermal stress imagery by parcel.',
    integrationIds: ['satellite-data'],
  },
  {
    id: 'greenhouse-climate-control',
    label: 'Climate Controller',
    description: 'Indoor ventilation and humidity automation feedback.',
    integrationIds: ['iot-sensors'],
  },
  {
    id: 'work-order-history',
    label: 'Work Order History',
    description: 'Crew tasks, treatment notes, and operation timing from FMS.',
    integrationIds: ['farm-management'],
  },
];

export const integrations = [
  {
    id: 'weather-api',
    name: 'Weather API',
    status: 'live',
    lastSyncMinutes: 2,
    coverage: 'Forecast windows, rain risk, wind',
    dataTypes: ['Rain probability', 'Wind speed', 'Overnight low'],
    description: 'Short-horizon weather model used to validate exposure and timing decisions.',
    sourceIds: ['weather-model'],
    farmTypeRelevance: {
      vineyard: 'supporting',
      orchard: 'primary',
      'open-field': 'primary',
      greenhouse: 'supporting',
    },
  },
  {
    id: 'iot-sensors',
    name: 'IoT Sensors',
    status: 'live',
    lastSyncMinutes: 1,
    coverage: 'Canopy, soil, indoor climate, control telemetry',
    dataTypes: ['Leaf wetness', 'Soil moisture', 'Local temperature', 'Controller response'],
    description: 'In-field and indoor telemetry that anchors the alert stack with high-frequency readings.',
    sourceIds: ['canopy-sensor-network', 'soil-probe-grid', 'irrigation-controller', 'greenhouse-climate-control'],
    farmTypeRelevance: {
      vineyard: 'primary',
      orchard: 'primary',
      'open-field': 'supporting',
      greenhouse: 'primary',
    },
  },
  {
    id: 'satellite-data',
    name: 'Satellite Data',
    status: 'syncing',
    lastSyncMinutes: 14,
    coverage: 'Vegetation and thermal stress scan',
    dataTypes: ['Vegetation index', 'Parcel heat map', 'Water stress bands'],
    description: 'Broad-area imagery that helps compare field zones and validate spread patterns.',
    sourceIds: ['satellite-observation'],
    farmTypeRelevance: {
      vineyard: 'supporting',
      orchard: 'supporting',
      'open-field': 'primary',
      greenhouse: 'background',
    },
  },
  {
    id: 'farm-management',
    name: 'Farm Management System',
    status: 'degraded',
    lastSyncMinutes: 42,
    coverage: 'Crew logs and treatment history',
    dataTypes: ['Task history', 'Work orders', 'Treatment notes'],
    description: 'Operational handoff layer that turns recommendations into crew-visible tasks.',
    sourceIds: ['work-order-history', 'irrigation-controller'],
    farmTypeRelevance: {
      vineyard: 'supporting',
      orchard: 'supporting',
      'open-field': 'supporting',
      greenhouse: 'supporting',
    },
  },
];

export const alertTemplates = [
  {
    id: 'humidity-spike',
    severity: 'critical',
    status: 'new',
    occurredMinutesAgo: 6,
    farmRelevance: {
      vineyard: 'primary',
      orchard: 'primary',
      greenhouse: 'primary',
    },
    sourceIds: ['canopy-sensor-network', 'weather-model'],
    fieldByFarm: {
      vineyard: 'vineyard-north-canopy',
      orchard: 'orchard-central-rows',
      greenhouse: 'greenhouse-seedling-corridor',
    },
    titles: {
      vineyard: 'Mildew pressure rising across the north canopy',
      orchard: 'Leaf wetness spike detected in the stone-fruit rows',
      greenhouse: 'Condensation event building in greenhouse bay 3',
    },
    summaries: {
      vineyard: 'Humidity climbed above the safe mildew threshold while airflow stayed weak in the north block.',
      orchard: 'Persistent leaf wetness is reducing the drying window across the central orchard rows.',
      greenhouse: 'Humidity is pooling above the condensation threshold near the eastern vents.',
    },
    reasons: {
      vineyard: 'Leaf wetness remained elevated for two sensor cycles while wind stayed too light to clear the canopy.',
      orchard: 'Canopy humidity and overnight temperature spread are overlapping in a pattern that precedes disease pressure.',
      greenhouse: 'Ventilation response is lagging behind a rapid humidity rise, creating a stable condensation pocket.',
    },
    actions: {
      vineyard: 'Advance spray-window review and open airflow lanes before the next humidity peak.',
      orchard: 'Increase row airflow checks and stage a targeted disease-prevention pass for the wettest block.',
      greenhouse: 'Raise ventilation and dehumidification settings in bay 3 before condensation settles on the crop.',
    },
    relevanceReasons: {
      vineyard: 'Primary because mildew pressure can escalate within one spray cycle in dense canopy zones.',
      orchard: 'Primary because sustained leaf wetness during bloom can quickly reduce fruit quality and raise disease risk.',
      greenhouse: 'Primary because condensation in closed environments can spread quickly without immediate HVAC correction.',
    },
    sourceContributions: {
      'canopy-sensor-network': {
        signal: 'Leaf wetness and in-row humidity stayed above safe thresholds across two consecutive sampling cycles.',
        interpretation: 'On-field conditions are already inside the window where fungal pressure accelerates.',
      },
      'weather-model': {
        signal: 'Forecast wind stayed weak while overnight humidity remained elevated.',
        interpretation: 'Natural drying is unlikely to recover in time, so the risk remains active.',
      },
    },
    timeline: [
      { minutesAgo: 31, label: 'Humidity crossed threshold', note: 'Canopy sensor cluster A reported an 88% humidity floor.' },
      { minutesAgo: 22, label: 'Secondary sensor confirmed', note: 'Nearby canopy node repeated the same rise pattern.' },
      { minutesAgo: 14, label: 'Alert promoted', note: 'Drying window collapsed below the configured minimum.' },
    ],
  },
  {
    id: 'irrigation-drift',
    severity: 'high',
    status: 'active',
    occurredMinutesAgo: 11,
    farmRelevance: {
      vineyard: 'primary',
      'open-field': 'primary',
      greenhouse: 'supporting',
    },
    sourceIds: ['irrigation-controller', 'soil-probe-grid', 'work-order-history'],
    fieldByFarm: {
      vineyard: 'vineyard-lower-terrace',
      'open-field': 'openfield-west-zones',
      greenhouse: 'greenhouse-bay-2',
    },
    titles: {
      vineyard: 'Block C irrigation drift is widening between rows',
      'open-field': 'Western field zones are losing moisture uniformity',
      greenhouse: 'Nutrient feed timing slipped out of target in bay 2',
    },
    summaries: {
      vineyard: 'The lower terrace is drying faster than the upper rows, increasing uneven vine stress.',
      'open-field': 'Moisture variance between west-side zones now exceeds the preferred irrigation spread.',
      greenhouse: 'The indoor nutrient cycle is lagging, which risks uneven uptake across the bay.',
    },
    reasons: {
      vineyard: 'Soil probes in the lower terrace show a sharper post-cycle drop than the upper terrace.',
      'open-field': 'Two irrigation zones failed to recover to the same moisture band after the previous watering window.',
      greenhouse: 'Controller logs show the nutrient mixer delayed the final dose segment by one cycle.',
    },
    actions: {
      vineyard: 'Rebalance valve timing for the lower terrace and recheck soil response after the next pulse.',
      'open-field': 'Inspect the western valves and stage a corrective moisture pass if drift continues.',
      greenhouse: 'Reset bay 2 feed schedule and confirm the next nutrient mix before the afternoon cycle.',
    },
    relevanceReasons: {
      vineyard: 'Primary because terrace imbalance can stress vines and compromise ripening consistency.',
      'open-field': 'Primary because wide-zone moisture drift can spread quickly and reduce uniform field performance.',
      greenhouse: 'Supporting because feed timing drift can create uneven uptake even when climate remains stable.',
    },
    sourceContributions: {
      'irrigation-controller': {
        signal: 'Valve and dosing logs show the cycle completed outside the expected timing envelope.',
        interpretation: 'Control behavior indicates the irrigation plan is drifting from configured targets.',
      },
      'soil-probe-grid': {
        signal: 'Post-cycle moisture recovery diverged between zones beyond tolerance.',
        interpretation: 'Field response confirms the drift is physical, not only a controller-side anomaly.',
      },
      'work-order-history': {
        signal: 'Recent treatment and crew activity overlap with the affected zones.',
        interpretation: 'Operational context increases confidence that the drift has immediate execution impact.',
      },
    },
    timeline: [
      { minutesAgo: 38, label: 'Cycle completed', note: 'Primary irrigation cycle ended without a fault flag.' },
      { minutesAgo: 29, label: 'Variance detected', note: 'Post-cycle moisture values diverged across target zones.' },
      { minutesAgo: 18, label: 'Manual review suggested', note: 'Trend exceeded the configured recovery tolerance.' },
    ],
  },
  {
    id: 'canopy-stress',
    severity: 'medium',
    status: 'monitoring',
    occurredMinutesAgo: 19,
    farmRelevance: {
      vineyard: 'supporting',
      orchard: 'supporting',
      'open-field': 'primary',
    },
    sourceIds: ['satellite-observation', 'canopy-sensor-network'],
    fieldByFarm: {
      vineyard: 'vineyard-north-canopy',
      orchard: 'orchard-central-rows',
      'open-field': 'openfield-central-band',
    },
    titles: {
      vineyard: 'Canopy temperature spread suggests early stress on exposed vines',
      orchard: 'Fruit-zone heat load is climbing on the south-facing rows',
      'open-field': 'Vegetation index is softening in the central field band',
    },
    summaries: {
      vineyard: 'The exposed rows are warming faster than the shaded side, hinting at uneven vine load.',
      orchard: 'South-facing rows are accumulating heat faster than the rest of the orchard block.',
      'open-field': 'Satellite and sensor signals both point to a mild stress band forming in the center plot.',
    },
    reasons: {
      vineyard: 'Temperature divergence between exposed and protected rows widened after the last sun window.',
      orchard: 'Canopy temperature and evapotranspiration estimates are both trending above orchard baseline.',
      'open-field': 'The latest vegetation pass aligns with slower moisture recovery in the central band.',
    },
    actions: {
      vineyard: 'Review canopy cooling measures and confirm irrigation balance before afternoon heat builds.',
      orchard: 'Inspect the hottest rows first and prep targeted cooling if the trend holds.',
      'open-field': 'Validate central-band moisture readings and adjust the next irrigation pass if stress expands.',
    },
    relevanceReasons: {
      vineyard: 'Supporting because heat spread can worsen canopy stress and reduce disease resilience in exposed rows.',
      orchard: 'Supporting because fruit-zone heat load can amplify stress if not corrected before peak sun.',
      'open-field': 'Primary because broad stress bands can expand rapidly and impact large production areas.',
    },
    sourceContributions: {
      'satellite-observation': {
        signal: 'Vegetation and thermal imagery identified a softening band in the target parcel.',
        interpretation: 'Broad-area imagery confirms stress is forming across more than one sensor point.',
      },
      'canopy-sensor-network': {
        signal: 'In-field temperature readings track above local baseline in the same zone.',
        interpretation: 'Ground telemetry validates that the remote signal reflects current field conditions.',
      },
    },
    timeline: [
      { minutesAgo: 44, label: 'Thermal drift observed', note: 'Temperature spread opened after sunrise.' },
      { minutesAgo: 33, label: 'Model confidence increased', note: 'Satellite and probe data aligned on the same band.' },
      { minutesAgo: 21, label: 'Monitoring kept active', note: 'Stress pattern remained stable after the latest sample.' },
    ],
  },
  {
    id: 'frost-pocket',
    severity: 'critical',
    status: 'active',
    occurredMinutesAgo: 24,
    farmRelevance: {
      vineyard: 'primary',
      orchard: 'primary',
    },
    sourceIds: ['weather-model', 'canopy-sensor-network'],
    fieldByFarm: {
      vineyard: 'vineyard-lower-terrace',
      orchard: 'orchard-blossom-lane',
    },
    titles: {
      vineyard: 'Cold-air pocket may settle in the lower vineyard terrace',
      orchard: 'Frost pocket risk is increasing around the blossom-sensitive rows',
    },
    summaries: {
      vineyard: 'Forecast and slope readings agree on a cold-air accumulation risk in the lower terrace.',
      orchard: 'Blossom-sensitive rows are entering a temperature band that requires frost protection prep.',
    },
    reasons: {
      vineyard: 'Calm wind, falling temperature, and slope geometry are aligning with terrace frost-pocket behavior.',
      orchard: 'The orchard block is tracking below the blossom safety margin while airflow is expected to stay weak.',
    },
    actions: {
      vineyard: 'Prepare frost mitigation for the lower terrace and confirm crew readiness before sunrise.',
      orchard: 'Stage blossom protection actions and verify the coldest rows first during the next patrol.',
    },
    relevanceReasons: {
      vineyard: 'Primary because terrace frost exposure can impact vine health and early-season yield potential.',
      orchard: 'Primary because blossom-stage temperature drops can cause immediate crop loss if untreated.',
    },
    sourceContributions: {
      'weather-model': {
        signal: 'Forecast updates show overnight lows and wind calmness inside frost-pocket conditions.',
        interpretation: 'Atmospheric conditions support cold-air pooling and a high likelihood of localized frost.',
      },
      'canopy-sensor-network': {
        signal: 'Lower-block canopy probes are cooling faster than surrounding zones.',
        interpretation: 'On-field telemetry confirms the model risk is materializing in the vulnerable rows.',
      },
    },
    timeline: [
      { minutesAgo: 52, label: 'Low-wind forecast confirmed', note: 'Updated weather feed reduced expected overnight airflow.' },
      { minutesAgo: 41, label: 'Terrain model matched', note: 'Cold-air pooling likelihood increased on the risk map.' },
      { minutesAgo: 27, label: 'Protection alert escalated', note: 'Temperature forecast moved inside the protection threshold.' },
    ],
  },
  {
    id: 'ventilation-slip',
    severity: 'medium',
    status: 'acknowledged',
    occurredMinutesAgo: 28,
    farmRelevance: {
      greenhouse: 'primary',
    },
    sourceIds: ['greenhouse-climate-control', 'canopy-sensor-network'],
    fieldByFarm: {
      greenhouse: 'greenhouse-seedling-corridor',
    },
    titles: {
      greenhouse: 'Ventilation response is lagging in the seedling corridor',
    },
    summaries: {
      greenhouse: 'The seedling corridor is recovering from heat slower than the airflow profile expects.',
    },
    reasons: {
      greenhouse: 'Fan output and corridor temperature are no longer converging after the last ventilation adjustment.',
    },
    actions: {
      greenhouse: 'Inspect the corridor fan group and tighten the response curve before the next warm cycle.',
    },
    relevanceReasons: {
      greenhouse: 'Primary because ventilation lag in seedling corridors can raise condensation risk and stunt growth.',
    },
    sourceContributions: {
      'greenhouse-climate-control': {
        signal: 'Controller feedback shows fan commands are not producing expected cooling recovery.',
        interpretation: 'The control loop is underperforming and requires direct mechanical or tuning checks.',
      },
      'canopy-sensor-network': {
        signal: 'Corridor temperature and humidity remained above target after ventilation changes.',
        interpretation: 'Sensor readings confirm the lag is affecting crop-zone conditions, not only control logs.',
      },
    },
    timeline: [
      { minutesAgo: 46, label: 'Ventilation command sent', note: 'Controller requested a standard cooling adjustment.' },
      { minutesAgo: 35, label: 'Recovery missed target', note: 'Temperature remained above the expected decay curve.' },
      { minutesAgo: 29, label: 'Acknowledged by operator', note: 'Crew flagged corridor fan inspection for the next round.' },
    ],
  },
  {
    id: 'wind-shift',
    severity: 'low',
    status: 'monitoring',
    occurredMinutesAgo: 33,
    farmRelevance: {
      'open-field': 'primary',
    },
    sourceIds: ['weather-model'],
    fieldByFarm: {
      'open-field': 'openfield-west-zones',
    },
    titles: {
      'open-field': 'Wind direction shifted ahead of the next spray window',
    },
    summaries: {
      'open-field': 'Field mast reports a direction shift that could change how the next spray pass is staged.',
    },
    reasons: {
      'open-field': 'Wind vectors rotated southwest and held long enough to affect field-entry planning.',
    },
    actions: {
      'open-field': 'Review spray timing and lane approach before the next field crew dispatch.',
    },
    relevanceReasons: {
      'open-field': 'Primary because spray planning in exposed fields depends directly on short-term wind direction stability.',
    },
    sourceContributions: {
      'weather-model': {
        signal: 'Wind vectors rotated southwest and held for multiple forecast intervals.',
        interpretation: 'Spray drift risk changed enough to require a routing and timing adjustment.',
      },
    },
    timeline: [
      { minutesAgo: 58, label: 'Wind started rotating', note: 'Direction began moving away from the morning baseline.' },
      { minutesAgo: 47, label: 'Shift confirmed', note: 'The mast held a southwest pattern for three consecutive checks.' },
      { minutesAgo: 37, label: 'Planning cue issued', note: 'Forecast engine marked the next spray window for review.' },
    ],
  },
];
