import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './RoadmapPresentation.css';
import mapBigImage from '../../../../map-big.png';
import mapLittleImage from '../../../../map-little.png';

const TOTAL_STEPS = 9;
const FOCUS_STEP = 5;
const FEATURED_STEP = 6;
const COSTS_STEP = FEATURED_STEP + 1;
const CONSORZI_REACH_STEP = FEATURED_STEP + 2;
const CONSORZI_REACH_LOCAL_VALUE = 458;
const CONSORZI_REACH_EXPANDED_VALUE = 25000;
const AZIENDE_PER_CONSORZIO = 50;
const JACKPOT_ROLL_DURATION_MS = 1280;
const JACKPOT_ROLL_FREQUENCY = 56;
const JACKPOT_MIN_JITTER = 12;
const IDENTIKIT_DELAY_MS = 360;
const SECOND_FARMER_DELAY_MS = 2960;
const SECOND_IDENTIKIT_DELAY_MS = 360;
const ROADMAP_STEP_STORAGE_KEY = 'app-shell-roadmap-step';
const ITALIAN_NUMBER_FORMATTER = new Intl.NumberFormat('it-IT');

const CONSORZIO_CENTER = { x: 50, y: 50 };
const FARMER_ARC_ANGLES = [-72, -46, -20, 20, 46, 72];
const FARMER_ARC_RADIUS = { x: 30, y: 27 };

function formatPoint(value) {
  return Number(value.toFixed(2));
}

function formatItalianNumber(value) {
  return ITALIAN_NUMBER_FORMATTER.format(value);
}

function clampRoadmapStep(step) {
  return Math.min(TOTAL_STEPS - 1, Math.max(0, step));
}

function readInitialRoadmapStep() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const rawValue = window.sessionStorage.getItem(ROADMAP_STEP_STORAGE_KEY);

    if (rawValue === null) {
      return 0;
    }

    const parsedValue = Number.parseInt(rawValue, 10);

    return Number.isNaN(parsedValue) ? 0 : clampRoadmapStep(parsedValue);
  } catch (error) {
    console.warn('Roadmap step restore skipped because sessionStorage is unavailable.', error);
    return 0;
  }
}

function getElementCenter(element, stageRect) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    x: formatPoint(rect.left - stageRect.left + rect.width / 2),
    y: formatPoint(rect.top - stageRect.top + rect.height / 2),
  };
}

function getElementBox(element, stageRect) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    left: formatPoint(rect.left - stageRect.left),
    top: formatPoint(rect.top - stageRect.top),
    right: formatPoint(rect.right - stageRect.left),
    bottom: formatPoint(rect.bottom - stageRect.top),
    width: formatPoint(rect.width),
    height: formatPoint(rect.height),
  };
}

const farmerNodes = FARMER_ARC_ANGLES.map((angle, index, angles) => {
  const radians = (angle * Math.PI) / 180;
  const x = CONSORZIO_CENTER.x + FARMER_ARC_RADIUS.x * Math.cos(radians);
  const y = CONSORZIO_CENTER.y + FARMER_ARC_RADIUS.y * Math.sin(radians);

  return {
    id: `farmer-${String(index + 1).padStart(2, '0')}`,
    x: `${x.toFixed(2)}%`,
    y: `${y.toFixed(2)}%`,
    delay: `${(0.08 + index * 0.07).toFixed(2)}s`,
    branchDelay: `${(0.42 + index * 0.11).toFixed(2)}s`,
    collapseDelay: `${(0.42 + index * 0.06).toFixed(2)}s`,
    order: index - (angles.length - 1) / 2,
  };
});

const TOP_FARMER = farmerNodes.reduce((currentTop, node) => {
  if (parseFloat(node.y) < parseFloat(currentTop.y)) {
    return node;
  }

  return currentTop;
}, farmerNodes[0]);

const THIRD_FARMER = farmerNodes[2];

const profileSequences = [
  {
    id: 'primary',
    farmerId: TOP_FARMER.id,
    tokens: [
      { id: 'sensor', label: 'Sensori', icon: 'sensor', offsetX: -104, offsetY: -96, delay: '0.02s' },
      { id: 'crop', label: 'Coltura', icon: 'crop', offsetX: -104, offsetY: -38, delay: '0.12s' },
    ],
  },
  {
    id: 'secondary',
    farmerId: THIRD_FARMER.id,
    tokens: [
      { id: 'satellite', label: 'Satellite', icon: 'satellite', offsetX: 68, offsetY: -92, delay: '0.02s' },
      { id: 'soil', label: 'Tipo di suolo', icon: 'soil', offsetX: 68, offsetY: -30, delay: '0.12s' },
    ],
  },
];

const costSlices = [
  { id: 'ui', label: 'UI + Prodotto', time: '2w', cost: '€6k', height: 33 },
  { id: 'integration', label: 'Integrazioni dati', time: '5w', cost: '€18k', height: 100, primary: true },
  { id: 'api-integration', label: 'APIs Integration', time: '3w', cost: '€9k', height: 50 },
  { id: 'ops', label: 'Ops mensile', time: 'continuo', cost: '€2k', height: 20 },
];

// Presentation-mode bars use explicit heights so pitch edits can control the visual hierarchy directly.
const costBoardSlices = [
  { id: 'ui', label: 'UI + Prodotto', time: '2w', cost: '\u20ac6k', height: 33, barDelay: '2.62s', markerTop: '10%', markerDelay: '3.16s' },
  {
    id: 'integration',
    label: 'Integrazioni dati',
    time: '5w',
    cost: '\u20ac18k',
    height: 100,
    primary: true,
    barDelay: '2.76s',
    markerTop: '45%',
    markerDelay: '3.34s',
  },
  {
    id: 'api-integration',
    label: 'APIs Integration',
    time: '3w',
    cost: '\u20ac9k',
    height: 50,
    barDelay: '2.9s',
    markerTop: '85%',
    markerDelay: '3.52s',
  },
];

const COST_TOTALS = {
  time: '10w',
  cost: '\u20ac33k',
};

function CompanyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3.8 19.5h16.4" />
      <path d="M6.2 19.5V8.4a1.2 1.2 0 0 1 1.2-1.2h4.2a1.2 1.2 0 0 1 1.2 1.2v11.1" />
      <path d="M12.8 19.5V11.2a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2v8.3" />
      <path d="M8.6 10.4h1.8" />
      <path d="M8.6 13.3h1.8" />
      <path d="M15.1 13.2h1.1" />
      <path d="M15.1 15.9h1.1" />
      <path d="M9.5 19.5v-3.2" />
    </svg>
  );
}

function ConsorzioIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="7.4" r="2.2" />
      <circle cx="6.6" cy="11.2" r="2" />
      <circle cx="17.4" cy="11.2" r="2" />
      <path d="M5 17a3.6 3.6 0 0 1 3.6-3.6h6.8A3.6 3.6 0 0 1 19 17" />
    </svg>
  );
}

function FarmerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.8 9.1h14.4" />
      <path d="M8.3 9.1c0-2 1.7-3.7 3.7-3.7s3.7 1.7 3.7 3.7" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M7.4 18.1a4.6 4.6 0 0 1 9.2 0" />
      <path d="M10.1 15.1 12 16.4l1.9-1.3" />
    </svg>
  );
}

function SensorSetupIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="M8.5 8.5 12 5l3.5 3.5" />
      <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
      <circle cx="12" cy="18.2" r="1.8" />
    </svg>
  );
}

function CropTypeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 4.8v14.4" />
      <path d="M12 8c1.8 0 3.2-1.5 3.2-3.3C13.4 4.7 12 6.2 12 8Z" />
      <path d="M12 10.9c1.7 0 3.1-1.4 3.1-3.1-1.7 0-3.1 1.4-3.1 3.1Z" />
      <path d="M12 13.8c1.6 0 2.9-1.3 2.9-2.9-1.6 0-2.9 1.3-2.9 2.9Z" />
      <path d="M12 9.3c-1.8 0-3.2-1.5-3.2-3.3 1.8 0 3.2 1.5 3.2 3.3Z" />
      <path d="M12 12.2c-1.7 0-3.1-1.4-3.1-3.1 1.7 0 3.1 1.4 3.1 3.1Z" />
      <path d="M12 15c-1.5 0-2.8-1.2-2.8-2.8 1.5 0 2.8 1.2 2.8 2.8Z" />
    </svg>
  );
}

function SatelliteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="4.5" rx="1" width="4.5" x="3.5" y="3.5" />
      <rect height="4.5" rx="1" width="4.5" x="16" y="16" />
      <path d="m7.4 7.4 9.2 9.2" />
      <path d="m13.4 5.8 4.8 4.8" />
      <path d="M5.8 13.4 10.6 18.2" />
    </svg>
  );
}

function SoilTypeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 9.2h10" />
      <path d="M5.2 13h13.6" />
      <path d="M6.4 16.8h11.2" />
      <path d="M8.1 6.4h7.8" />
      <path d="m9 13-1.2 3.8" />
      <path d="m15 13 1.2 3.8" />
    </svg>
  );
}

function ArrowIcon({ direction }) {
  const transform = direction === 'back' ? 'rotate(180 12 12)' : undefined;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <g transform={transform}>
        <path d="M6 12h12" />
        <path d="M13 7l5 5-5 5" />
      </g>
    </svg>
  );
}

function RoadmapPresentation() {
  const [step, setStep] = useState(() => readInitialRoadmapStep());
  const [activeProfileIndex, setActiveProfileIndex] = useState(() => (step > FOCUS_STEP ? profileSequences.length - 1 : 0));
  const [revealedProfileIds, setRevealedProfileIds] = useState(() => (step > FOCUS_STEP ? profileSequences.map((sequence) => sequence.id) : []));
  const [profileSequenceComplete, setProfileSequenceComplete] = useState(() => step > FOCUS_STEP);
  const [isConsorziReachExpanded, setIsConsorziReachExpanded] = useState(false);
  const [displayedConsorziCount, setDisplayedConsorziCount] = useState(CONSORZI_REACH_LOCAL_VALUE);
  const [connectionLayout, setConnectionLayout] = useState({
    width: 0,
    height: 0,
    bridgePath: '',
    trunkPath: '',
    branchPaths: {},
    farmerCenters: {},
    featuredPath: '',
  });
  const roadmapRef = useRef(null);
  const stageRef = useRef(null);
  const jackpotCountRef = useRef(CONSORZI_REACH_LOCAL_VALUE);
  const companyRef = useRef(null);
  const consorzioRef = useRef(null);
  const featuredFarmerRef = useRef(null);
  const farmerRefs = useRef({});
  const lastStep = TOTAL_STEPS - 1;
  const canGoBack = step > 0;
  const showCompany = step >= 1;
  const showConsorzio = step >= 2;
  const showBridge = step >= 3;
  const showFarmers = step >= 4;
  const showProfileFocus = step === FOCUS_STEP;
  // Keep the small-farmer identikits mounted after the focus step so the featured farmer
  // and the later collapse-to-Costi transition can reference the same emitted context.
  const showIdentikit = step >= FOCUS_STEP && revealedProfileIds.length > 0;
  // Keep the featured farmer mounted into the Costi step so it can retract as part of the reverse animation.
  const showFeaturedCase = step >= FEATURED_STEP;
  const showCostsLayout = step >= COSTS_STEP;
  const showCosts = step === COSTS_STEP;
  const showConsorziReach = step >= CONSORZI_REACH_STEP;
  const isConsorziReachStep = step === CONSORZI_REACH_STEP;
  const canAdvanceConsorziReach = isConsorziReachStep && !isConsorziReachExpanded;
  const canAdvance = (step < lastStep && !(showProfileFocus && !profileSequenceComplete)) || canAdvanceConsorziReach;
  const reachableConsorziCount = isConsorziReachExpanded ? CONSORZI_REACH_EXPANDED_VALUE : CONSORZI_REACH_LOCAL_VALUE;
  const formattedReachableConsorzi = formatItalianNumber(displayedConsorziCount);
  const reachableAziendeCount = displayedConsorziCount * AZIENDE_PER_CONSORZIO;
  const formattedReachableAziende = formatItalianNumber(reachableAziendeCount);
  const activeProfileSequence = profileSequences[activeProfileIndex];
  const activeProfileFarmerId = activeProfileSequence.farmerId;
  const revealedProfileSequences = profileSequences.filter((sequence) => revealedProfileIds.includes(sequence.id));

  useEffect(() => {
    roadmapRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(ROADMAP_STEP_STORAGE_KEY, String(step));
    } catch (error) {
      console.warn('Roadmap step persistence skipped because sessionStorage is unavailable.', error);
    }
  }, [step]);

  useEffect(() => {
    if (!isConsorziReachStep) {
      setIsConsorziReachExpanded(false);
    }
  }, [isConsorziReachStep]);

  useEffect(() => {
    if (!isConsorziReachStep || isConsorziReachExpanded) {
      return;
    }

    // Re-prime the slot-style roll whenever the local phase is reached.
    jackpotCountRef.current = 0;
    setDisplayedConsorziCount(0);
  }, [isConsorziReachStep, isConsorziReachExpanded]);

  useEffect(() => {
    if (!showConsorziReach) {
      jackpotCountRef.current = CONSORZI_REACH_LOCAL_VALUE;
      setDisplayedConsorziCount(CONSORZI_REACH_LOCAL_VALUE);
      return undefined;
    }

    const targetValue = reachableConsorziCount;
    const startValue = jackpotCountRef.current;

    if (startValue >= targetValue) {
      jackpotCountRef.current = targetValue;
      setDisplayedConsorziCount(targetValue);
      return undefined;
    }

    let frameId = 0;
    let animationStart = 0;
    let previousValue = startValue;

    const animateJackpotRoll = (timestamp) => {
      if (animationStart === 0) {
        animationStart = timestamp;
      }

      const elapsed = timestamp - animationStart;
      const progress = Math.min(elapsed / JACKPOT_ROLL_DURATION_MS, 1);
      const easedProgress = 1 - (1 - progress) ** 4;
      const baseValue = startValue + (targetValue - startValue) * easedProgress;
      const jitterWindow = progress < 0.84 ? 1 - progress / 0.84 : 0;
      const jitterAmplitude = Math.max((targetValue - startValue) * 0.08, JACKPOT_MIN_JITTER) * jitterWindow;
      const jitter = Math.abs(Math.sin(progress * JACKPOT_ROLL_FREQUENCY)) * jitterAmplitude;
      const candidate = Math.round(Math.min(targetValue, baseValue + jitter));
      const nextValue = Math.max(previousValue, candidate);

      previousValue = nextValue;
      jackpotCountRef.current = nextValue;
      setDisplayedConsorziCount(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateJackpotRoll);
        return;
      }

      jackpotCountRef.current = targetValue;
      setDisplayedConsorziCount(targetValue);
    };

    frameId = window.requestAnimationFrame(animateJackpotRoll);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [showConsorziReach, reachableConsorziCount]);

  useEffect(() => {
    if (step < FOCUS_STEP) {
      setActiveProfileIndex(0);
      setRevealedProfileIds([]);
      setProfileSequenceComplete(false);
      return undefined;
    }

    if (step > FOCUS_STEP) {
      setActiveProfileIndex(profileSequences.length - 1);
      setRevealedProfileIds(profileSequences.map((sequence) => sequence.id));
      setProfileSequenceComplete(true);
      return undefined;
    }

    setActiveProfileIndex(0);
    setRevealedProfileIds([]);
    setProfileSequenceComplete(false);

    // The two farmer identikits are one automatic sequence inside the same stage,
    // and each burst stays visible so the comparison reads as cumulative.
    const firstBurstTimer = window.setTimeout(() => {
      setRevealedProfileIds((current) => (current.includes(profileSequences[0].id) ? current : [profileSequences[0].id]));
    }, IDENTIKIT_DELAY_MS);

    const secondFocusTimer = window.setTimeout(() => {
      setActiveProfileIndex(1);
    }, SECOND_FARMER_DELAY_MS);

    const secondBurstTimer = window.setTimeout(() => {
      setRevealedProfileIds((current) => {
        const nextIds = [...current];

        if (!nextIds.includes(profileSequences[0].id)) {
          nextIds.push(profileSequences[0].id);
        }

        if (!nextIds.includes(profileSequences[1].id)) {
          nextIds.push(profileSequences[1].id);
        }

        return nextIds;
      });
      setProfileSequenceComplete(true);
    }, SECOND_FARMER_DELAY_MS + SECOND_IDENTIKIT_DELAY_MS);

    return () => {
      window.clearTimeout(firstBurstTimer);
      window.clearTimeout(secondFocusTimer);
      window.clearTimeout(secondBurstTimer);
    };
  }, [step]);

  useLayoutEffect(() => {
    const stageElement = stageRef.current;

    if (!stageElement) {
      return undefined;
    }

    let frameId = 0;

    const measureConnections = () => {
      const stageRect = stageElement.getBoundingClientRect();

      if (!stageRect.width || !stageRect.height) {
        return;
      }

      const width = formatPoint(stageRect.width);
      const height = formatPoint(stageRect.height);
      const nextLayout = {
        width,
        height,
        bridgePath: '',
        trunkPath: '',
        branchPaths: {},
        farmerCenters: {},
        featuredPath: '',
      };

      const companyCenter = getElementCenter(companyRef.current, stageRect);
      const consorzioCenter = getElementCenter(consorzioRef.current, stageRect);

      if (showBridge && companyCenter && consorzioCenter) {
        const bridgeDistance = consorzioCenter.x - companyCenter.x;
        const bridgeLift = Math.min(Math.max(height * 0.022, 10), 18);

        nextLayout.bridgePath = [
          `M ${companyCenter.x} ${companyCenter.y}`,
          `C ${formatPoint(companyCenter.x + bridgeDistance * 0.34)} ${formatPoint(companyCenter.y + bridgeLift * 0.42)},`,
          `${formatPoint(companyCenter.x + bridgeDistance * 0.74)} ${formatPoint(consorzioCenter.y - bridgeLift * 0.28)},`,
          `${consorzioCenter.x} ${consorzioCenter.y}`,
        ].join(' ');
      }

      if (showFarmers && consorzioCenter) {
        const farmerCenters = farmerNodes
          .map((node) => {
            const element = farmerRefs.current[node.id];
            const center = getElementCenter(element, stageRect);
            return center ? { id: node.id, center, order: node.order } : null;
          })
          .filter(Boolean);

        if (farmerCenters.length > 0) {
          farmerCenters.forEach((node) => {
            nextLayout.farmerCenters[node.id] = node.center;
          });

          const averageFarmerX =
            farmerCenters.reduce((sum, node) => sum + node.center.x, 0) / farmerCenters.length;
          const branchHub = {
            x: formatPoint(consorzioCenter.x + (averageFarmerX - consorzioCenter.x) * 0.34),
            y: consorzioCenter.y,
          };
          const trunkDistance = branchHub.x - consorzioCenter.x;
          const trunkLift = Math.min(Math.max(height * 0.012, 4), 10);
          const branchSpread = Math.min(Math.max(height * 0.012, 6), 12);

          nextLayout.trunkPath = [
            `M ${consorzioCenter.x} ${consorzioCenter.y}`,
            `C ${formatPoint(consorzioCenter.x + trunkDistance * 0.42)} ${formatPoint(consorzioCenter.y + trunkLift * 0.36)},`,
            `${formatPoint(consorzioCenter.x + trunkDistance * 0.78)} ${formatPoint(branchHub.y - trunkLift * 0.22)},`,
            `${branchHub.x} ${branchHub.y}`,
          ].join(' ');

          farmerCenters.forEach((node) => {
            const controlX = formatPoint(branchHub.x + (node.center.x - branchHub.x) * 0.56);
            const controlY = formatPoint(
              branchHub.y + (node.center.y - branchHub.y) * 0.48 + node.order * branchSpread,
            );

            nextLayout.branchPaths[node.id] = `M ${branchHub.x} ${branchHub.y} Q ${controlX} ${controlY} ${node.center.x} ${node.center.y}`;
          });
        }
      }

      if (showFeaturedCase) {
        const companyBox = getElementBox(companyRef.current, stageRect);
        const featuredBox = getElementBox(featuredFarmerRef.current, stageRect);

        if (companyBox && featuredBox) {
          const startX = formatPoint(companyBox.left + companyBox.width * 0.52);
          const startY = formatPoint(companyBox.bottom + 8);
          const endX = formatPoint(featuredBox.left + featuredBox.width * 0.26);
          const endY = formatPoint(featuredBox.top + featuredBox.height * 0.3);
          const elbowY = formatPoint(startY + Math.min(Math.max(height * 0.17, 36), 88));

          nextLayout.featuredPath = [`M ${startX} ${startY}`, `L ${startX} ${elbowY}`, `L ${endX} ${endY}`].join(' ');
        }
      }

      setConnectionLayout((current) => {
        const sameLayout =
          current.width === nextLayout.width &&
          current.height === nextLayout.height &&
          current.bridgePath === nextLayout.bridgePath &&
          current.trunkPath === nextLayout.trunkPath &&
          JSON.stringify(current.branchPaths) === JSON.stringify(nextLayout.branchPaths) &&
          JSON.stringify(current.farmerCenters) === JSON.stringify(nextLayout.farmerCenters) &&
          current.featuredPath === nextLayout.featuredPath;

        return sameLayout ? current : nextLayout;
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measureConnections);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(stageElement);

    if (companyRef.current) {
      resizeObserver.observe(companyRef.current);
    }

    if (consorzioRef.current) {
      resizeObserver.observe(consorzioRef.current);
    }

    if (featuredFarmerRef.current) {
      resizeObserver.observe(featuredFarmerRef.current);
    }

    Object.values(farmerRefs.current).forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    scheduleMeasure();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [showBridge, showFarmers, showCompany, showConsorzio, showFeaturedCase, step]);

  const advanceStep = () => {
    if (isConsorziReachStep && !isConsorziReachExpanded) {
      setIsConsorziReachExpanded(true);
      return;
    }

    if (canAdvance) {
      setStep((current) => Math.min(lastStep, current + 1));
    }
  };

  const retreatStep = () => {
    if (isConsorziReachStep && isConsorziReachExpanded) {
      setIsConsorziReachExpanded(false);
      return;
    }

    if (canGoBack) {
      setStep((current) => Math.max(0, current - 1));
    }
  };

  const handleStageClick = (event) => {
    if (event.target.closest('[data-roadmap-control]')) {
      return;
    }

    advanceStep();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advanceStep();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      retreatStep();
    }
  };

  return (
    <article
      className={`roadmap-presentation roadmap-presentation--step-${step}${showProfileFocus ? ' roadmap-presentation--profile-focus' : ''}${showIdentikit ? ' roadmap-presentation--identikit' : ''}${showFeaturedCase ? ' roadmap-presentation--featured-case' : ''}${showCostsLayout ? ' roadmap-presentation--costs' : ''}${showConsorziReach ? ' roadmap-presentation--consorzi-reach' : ''}`}
      onClick={handleStageClick}
      onKeyDown={handleKeyDown}
      ref={roadmapRef}
      tabIndex={0}
    >
      <section aria-label="Roadmap canvas" className="roadmap-stage" ref={stageRef} role="presentation">
        {showBridge && connectionLayout.bridgePath ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--bridge"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionLayout.width} ${connectionLayout.height}`}
          >
            <path className="roadmap-path roadmap-path--bridge" d={connectionLayout.bridgePath} pathLength="1" />
          </svg>
        ) : null}

        {showFarmers && connectionLayout.trunkPath ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--distribution"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionLayout.width} ${connectionLayout.height}`}
          >
            <path className="roadmap-path roadmap-path--trunk" d={connectionLayout.trunkPath} pathLength="1" />
            {farmerNodes.map((node) => (
              <path
                className={`roadmap-path roadmap-path--branch${node.id === activeProfileFarmerId && showProfileFocus ? ' roadmap-path--focus-branch' : ''}`}
                d={connectionLayout.branchPaths[node.id]}
                key={`${node.id}-line`}
                pathLength="1"
                style={{ '--path-delay': node.branchDelay, '--collapse-delay': node.collapseDelay }}
              />
            ))}
          </svg>
        ) : null}

        {showCompany ? (
          <article className="roadmap-node roadmap-node--company" ref={companyRef}>
            <span className="roadmap-node__icon">
              <CompanyIcon />
            </span>
            <span className="roadmap-node__label">Start-Up</span>
          </article>
        ) : null}

        {showConsorzio ? (
          <article className={`roadmap-node roadmap-node--consorzio${showFarmers ? ' is-distributing' : ''}`} ref={consorzioRef}>
            <span className="roadmap-node__icon">
              <ConsorzioIcon />
            </span>
            <span className="roadmap-node__label">Consorzio</span>
          </article>
        ) : null}

        <ul className={`roadmap-farmers${showFarmers ? ' is-visible' : ''}`}>
          {farmerNodes.map((node, index) => (
            <li
              aria-label={`Agricoltore ${index + 1}`}
              className={`roadmap-node roadmap-node--farmer${node.id === activeProfileFarmerId && showProfileFocus ? ' is-selected' : ''}`}
              key={node.id}
              ref={(element) => {
                if (element) {
                  farmerRefs.current[node.id] = element;
                  return;
                }

                delete farmerRefs.current[node.id];
              }}
              style={{
                '--node-delay': node.delay,
                '--node-x': node.x,
                '--node-y': node.y,
                '--collapse-delay': node.collapseDelay,
              }}
            >
              <span className="roadmap-node__farmer-core">
                <FarmerIcon />
              </span>
            </li>
          ))}
        </ul>

        {showIdentikit
          ? revealedProfileSequences.map((sequence) => {
              const farmerCenter = connectionLayout.farmerCenters[sequence.farmerId];

              if (!farmerCenter) {
                return null;
              }

              return (
                <div
                  aria-hidden="true"
                  className={`roadmap-identikit roadmap-identikit--${sequence.id}`}
                  key={sequence.id}
                  style={{
                    '--identikit-origin-x': `${farmerCenter.x}px`,
                    '--identikit-origin-y': `${farmerCenter.y}px`,
                  }}
                >
                  {sequence.tokens.map((token) => (
                    <article
                      className={`roadmap-identikit__token roadmap-identikit__token--${token.id}`}
                      key={token.id}
                      style={{
                        '--burst-x': `${token.offsetX}px`,
                        '--burst-y': `${token.offsetY}px`,
                        '--burst-delay': token.delay,
                      }}
                    >
                      <span className="roadmap-identikit__icon">
                        {token.icon === 'sensor' ? <SensorSetupIcon /> : null}
                        {token.icon === 'crop' ? <CropTypeIcon /> : null}
                        {token.icon === 'satellite' ? <SatelliteIcon /> : null}
                        {token.icon === 'soil' ? <SoilTypeIcon /> : null}
                      </span>
                      <span className="roadmap-identikit__copy">{token.label}</span>
                    </article>
                  ))}
                </div>
              );
            })
          : null}

        {showFeaturedCase && connectionLayout.featuredPath ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--feature"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionLayout.width} ${connectionLayout.height}`}
          >
            <path className="roadmap-path roadmap-path--feature" d={connectionLayout.featuredPath} pathLength="1" />
          </svg>
        ) : null}

        {showFeaturedCase ? (
          <article aria-label="Azienda esempio" className="roadmap-featured-farmer" ref={featuredFarmerRef}>
            <div className="roadmap-featured-farmer__body">
              <span className="roadmap-featured-farmer__icon">
                <FarmerIcon />
              </span>
              <div className="roadmap-featured-farmer__copy">
                <strong>Profilo agricolo mirato</strong>
                <span>Sensori, satellite, suolo</span>
              </div>
            </div>
          </article>
        ) : null}

        {showCosts ? (
          <aside aria-label="Costi e tempi" className="roadmap-costs">
            <span aria-hidden="true" className="roadmap-costs__support roadmap-costs__support--left" />
            <span aria-hidden="true" className="roadmap-costs__support roadmap-costs__support--right" />

            <div className="roadmap-costs__panel">
            <header className="roadmap-costs__header">
              <p className="roadmap-costs__title">Costi</p>
              <p className="roadmap-costs__totals">
                <span>{COST_TOTALS.time}</span>
                <span>{`~${COST_TOTALS.cost}`}</span>
              </p>
            </header>

            <div className="roadmap-costs__body">
              <ul className="roadmap-costs__chart">
                {costBoardSlices.map((slice) => (
                  <li className={`roadmap-costs__chart-item${slice.primary ? ' is-primary' : ''}`} key={slice.id}>
                    <div className="roadmap-costs__plot">
                      <span aria-hidden="true" className="roadmap-costs__bar-rail">
                        <span
                          className="roadmap-costs__bar"
                          style={{
                            '--cost-height': `${slice.height}%`,
                            '--bar-delay': slice.barDelay,
                          }}
                        />
                      </span>
                    </div>

                    <p className="roadmap-costs__label">{slice.label}</p>
                    <p className="roadmap-costs__meta">
                      <span>{slice.time}</span>
                      <span>{slice.cost}</span>
                    </p>
                  </li>
                ))}
              </ul>

              <div aria-hidden="true" className="roadmap-costs__timeline">
                <span className="roadmap-costs__timeline-rail">
                  <span className="roadmap-costs__timeline-fill" />
                </span>

                <ul className="roadmap-costs__timeline-markers">
                  {costBoardSlices.map((slice) => (
                    <li
                      className="roadmap-costs__timeline-marker"
                      key={`timeline-${slice.id}`}
                      style={{
                        '--marker-top': slice.markerTop,
                        '--marker-delay': slice.markerDelay,
                      }}
                    >
                      <span className="roadmap-costs__timeline-dot" />
                      <span className="roadmap-costs__timeline-text">{slice.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </aside>
        ) : null}

        {showConsorziReach ? (
          <aside aria-label="Espansione consorzi" className="roadmap-market-reach">
            <div className="roadmap-market-reach__panel">
              <header className="roadmap-market-reach__header">
                <p className="roadmap-market-reach__location" aria-live="polite">
                  <span className={`roadmap-market-reach__location-text${isConsorziReachExpanded ? '' : ' is-visible'}`}>
                    Trentino
                  </span>
                  <span className={`roadmap-market-reach__location-text roadmap-market-reach__location-text--next${isConsorziReachExpanded ? ' is-visible' : ''}`}>
                    Nord Italia
                  </span>
                </p>
              </header>

              <div className="roadmap-market-reach__map-area">
                <div className={`roadmap-market-reach__map-stack${isConsorziReachExpanded ? ' is-expanded' : ''}`}>
                  {/* Source files are inverted by name: `map-big` is Trentino zoom, `map-little` is Nord Italia. */}
                  <img alt="Mappa Trentino" className="roadmap-market-reach__map roadmap-market-reach__map--little" src={mapBigImage} />
                  <img alt="Mappa Nord Italia" className="roadmap-market-reach__map roadmap-market-reach__map--big" src={mapLittleImage} />
                </div>
              </div>

              <div className="roadmap-market-reach__metrics">
                <div className="roadmap-market-reach__metric">
                  <p className="roadmap-market-reach__metric-value">{formattedReachableConsorzi}</p>
                  <p className="roadmap-market-reach__metric-label">consorzi</p>
                </div>
                <div className="roadmap-market-reach__metric">
                  <p className="roadmap-market-reach__metric-value">{formattedReachableAziende}</p>
                  <p className="roadmap-market-reach__metric-label">aziende agricole</p>
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <div className="roadmap-controls" data-roadmap-control>
          <button
            aria-label="Step precedente"
            data-roadmap-control
            disabled={!canGoBack}
            onClick={retreatStep}
            type="button"
          >
            <ArrowIcon direction="back" />
          </button>
          <button
            aria-label="Step successivo"
            data-roadmap-control
            disabled={!canAdvance}
            onClick={advanceStep}
            type="button"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </section>
    </article>
  );
}

export default RoadmapPresentation;
