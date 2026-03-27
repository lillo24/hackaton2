import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SourceIcon from './SourceIcon';
import './IntroTerminal.css';

const TERMINAL_LINES = [
  { id: 'init-profile', tag: 'init', text: 'loading simulation profile', delay: 96 },
  { id: 'init-config', tag: 'init', text: 'config checksum verified', delay: 92 },
  { id: 'init-cache', tag: 'init', text: 'warming deterministic cache', delay: 88 },
  { id: 'sensor-air', tag: 'sensor', text: 'air_temp stream online', delay: 84 },
  { id: 'sensor-soil-temp', tag: 'sensor', text: 'soil_temp stream online', delay: 82 },
  { id: 'sensor-soil-moisture', tag: 'sensor', text: 'soil_moisture stream online', delay: 80 },
  { id: 'sensor-humidity', tag: 'sensor', text: 'humidity stream online', delay: 78 },
  { id: 'sensor-wind', tag: 'sensor', text: 'wind_gust stream online', delay: 76 },
  { id: 'meteo-forecast', tag: 'meteo', text: 'forecast horizon loaded', delay: 74 },
  { id: 'meteo-baseline', tag: 'meteo', text: 'historical baseline synced', delay: 72 },
  { id: 'meteo-grid', tag: 'meteo', text: 'microclimate grid aligned', delay: 70 },
  { id: 'calc-normalize', tag: 'calc', text: 'normalizing vineyard signals', delay: 68 },
  { id: 'calc-window', tag: 'calc', text: 'anomaly window detected', delay: 66 },
  { id: 'calc-gradient', tag: 'calc', text: 'temperature gradient solved', delay: 64 },
  { id: 'calc-drift', tag: 'calc', text: 'drift correction converged', delay: 62 },
  { id: 'risk-score', tag: 'risk', text: 'frost_risk = 92', delay: 60 },
  { id: 'risk-field', tag: 'risk', text: 'priority = vineyard_north', delay: 58 },
  { id: 'risk-spread', tag: 'risk', text: 'spread band = high confidence', delay: 56 },
  { id: 'alert-template', tag: 'alert', text: 'alert template hydrated', delay: 54 },
  { id: 'alert-ready', tag: 'alert', text: 'notification payload ready', delay: 52 },
  { id: 'export-sign', tag: 'export', text: 'handoff packet signed', delay: 50 },
  { id: 'export-handoff', tag: 'export', text: 'pitch handoff locked', delay: 48 },
  { id: 'calc-latency', tag: 'calc', text: 'pipeline latency within threshold', delay: 72 },
  { id: 'sensor-leaf', tag: 'sensor', text: 'leaf_temp stream online', delay: 71 },
  { id: 'sensor-rain', tag: 'sensor', text: 'rain_index stream online', delay: 70 },
  { id: 'meteo-pressure', tag: 'meteo', text: 'pressure delta merged', delay: 69 },
  { id: 'meteo-dew', tag: 'meteo', text: 'dew point projection synced', delay: 68 },
  { id: 'calc-canopy', tag: 'calc', text: 'canopy exposure model solved', delay: 67 },
  { id: 'calc-slope', tag: 'calc', text: 'terrain slope compensation applied', delay: 66 },
  { id: 'risk-window', tag: 'risk', text: 'critical window = 03:10-05:00', delay: 65 },
  { id: 'risk-duration', tag: 'risk', text: 'estimated exposure = 47 min', delay: 64 },
  { id: 'risk-confidence', tag: 'risk', text: 'confidence = 0.94', delay: 63 },
  { id: 'alert-channel', tag: 'alert', text: 'mobile push channel primed', delay: 62 },
  { id: 'alert-locale', tag: 'alert', text: 'it-IT message rendering complete', delay: 61 },
  { id: 'alert-priority', tag: 'alert', text: 'priority lane reserved', delay: 60 },
  { id: 'export-queue', tag: 'export', text: 'notification queued for dispatch', delay: 59 },
  { id: 'export-route', tag: 'export', text: 'edge route selected = phone_bridge', delay: 58 },
  { id: 'init-audit', tag: 'init', text: 'runtime audit stamp recorded', delay: 57 },
  { id: 'sensor-heartbeat', tag: 'sensor', text: 'stream heartbeat stable', delay: 56 },
  { id: 'meteo-lock', tag: 'meteo', text: 'forecast revision locked', delay: 55 },
  { id: 'calc-finalize', tag: 'calc', text: 'final scoring pass complete', delay: 54 },
  { id: 'risk-final', tag: 'risk', text: 'final frost_risk remains 92', delay: 53 },
  { id: 'alert-final', tag: 'alert', text: 'dispatch payload checksum ok', delay: 52 },
  { id: 'export-seal', tag: 'export', text: 'delivery manifest sealed', delay: 51 },
  { id: 'export-commit', tag: 'export', text: 'handoff commit acknowledged', delay: 50 },
  { id: 'export-sync', tag: 'export', text: 'phone startup signal synced', delay: 49 },
  { id: 'export-done', tag: 'export', text: 'simulation relay complete', delay: 48 },
];

const SOURCE_FEEDS = [
  { id: 'sensor', label: 'Sensors', type: 'sensor' },
  { id: 'weather', label: 'Weather', type: 'weather' },
  { id: 'satellite', label: 'Satellite', type: 'satellite' },
];

const SOURCE_SETTLE_MS = 460;
const FEEDING_MS = 880;
const COMPLETE_PAUSE_MS = 320;
const BUBBLE_SETTLE_MS = 760;
const CONNECT_TO_PHONE_MS = 860;
const COLLAPSE_DURATION_MS = 920;
const TERMINAL_GAP_CENTERING_FACTOR = 0.75;

function buildPhoneConnectorPath({ bubbleX, bubbleY, phoneX, phoneY }) {
  const horizontalSpan = Math.max(phoneX - bubbleX, 48);
  const controlOneX = bubbleX + Math.max(34, horizontalSpan * 0.24);
  const controlTwoX = bubbleX + Math.max(82, horizontalSpan * 0.72);

  return `M ${bubbleX} ${bubbleY} C ${controlOneX} ${bubbleY}, ${controlTwoX} ${phoneY}, ${phoneX} ${phoneY}`;
}

function getStatusCopy(phase) {
  if (phase === 'sources') {
    return 'Sources';
  }

  if (phase === 'feeding') {
    return 'Feeding';
  }

  if (phase === 'running') {
    return 'Running';
  }

  if (phase === 'collapsing') {
    return 'Compressing';
  }

  if (phase === 'bubble') {
    return 'Node';
  }

  if (phase === 'connectingToPhone') {
    return 'Sending';
  }

  if (phase === 'handoffToPhone') {
    return 'Delivered';
  }

  return 'Idle';
}

function getFooterCopy(phase) {
  if (phase === 'sources') {
    return 'Locking the three upstream sources into the intake strip';
  }

  if (phase === 'feeding') {
    return 'Sensor, meteo, and satellite signals are flowing into the processor';
  }

  if (phase === 'running') {
    return 'Streaming deterministic demo telemetry';
  }

  if (phase === 'collapsing') {
    return 'Condensing the simulation window into a single decision core';
  }

  if (phase === 'bubble') {
    return 'Decision core stable. Branch lines hook in here next.';
  }

  if (phase === 'connectingToPhone') {
    return 'Sending the processed alert payload into the phone trigger point';
  }

  if (phase === 'handoffToPhone') {
    return 'Phone trigger reached. Startup sequence is now in the phone layer.';
  }

  return 'Click the stage or press Space to run the simulation';
}

function IntroTerminal({ layout = null, phase = 'hidden', onPhoneTrigger, onPhaseComplete }) {
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [phoneConnectorPath, setPhoneConnectorPath] = useState('');
  const [renderedTerminalWidth, setRenderedTerminalWidth] = useState(null);
  const outputRef = useRef(null);
  const rootRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const onPhoneTriggerRef = useRef(onPhoneTrigger);
  const onPhaseCompleteRef = useRef(onPhaseComplete);
  const hasReportedBubbleCompletionRef = useRef(false);
  const hasTriggeredPhoneRef = useRef(false);
  const hasReportedRunCompletionRef = useRef(false);
  const hasReportedCollapseCompletionRef = useRef(false);

  useEffect(() => {
    onPhoneTriggerRef.current = onPhoneTrigger;
  }, [onPhoneTrigger]);

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const rootNode = rootRef.current;

    const measureWidth = () => {
      const { width } = rootNode.getBoundingClientRect();

      setRenderedTerminalWidth((currentWidth) => {
        if (currentWidth !== null && Math.abs(currentWidth - width) < 0.25) {
          return currentWidth;
        }

        return width;
      });
    };

    measureWidth();

    const resizeObserver = new ResizeObserver(() => {
      measureWidth();
    });

    resizeObserver.observe(rootNode);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!layout || !rootRef.current) {
      setPhoneConnectorPath('');
      return;
    }

    const rootRect = rootRef.current.getBoundingClientRect();
    const rootLeftInStage = rootRect.left - layout.stageLeft;
    const rootTopInStage = rootRect.top - layout.stageTop;
    const bubbleX = rootRect.width / 2;
    const bubbleY = rootRect.height / 2;
    const phoneX = layout.phoneTriggerX - rootLeftInStage;
    const phoneY = layout.phoneTriggerY - rootTopInStage;

    setPhoneConnectorPath(
      buildPhoneConnectorPath({
        bubbleX,
        bubbleY,
        phoneX,
        phoneY,
      }),
    );
  }, [layout, phase]);

  useEffect(() => {
    timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutIdsRef.current = [];

    if (phase === 'hidden') {
      setVisibleLineCount(0);
      hasReportedBubbleCompletionRef.current = false;
      hasTriggeredPhoneRef.current = false;
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;
      return undefined;
    }

    if (phase === 'visible') {
      setVisibleLineCount(0);
      hasReportedBubbleCompletionRef.current = false;
      hasTriggeredPhoneRef.current = false;
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;
      return undefined;
    }

    if (phase === 'sources') {
      setVisibleLineCount(0);
      hasReportedBubbleCompletionRef.current = false;
      hasTriggeredPhoneRef.current = false;
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;

      const sourcesTimeoutId = window.setTimeout(() => {
        onPhaseCompleteRef.current?.('sources');
      }, SOURCE_SETTLE_MS);

      timeoutIdsRef.current.push(sourcesTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'feeding') {
      setVisibleLineCount(0);
      hasReportedBubbleCompletionRef.current = false;
      hasTriggeredPhoneRef.current = false;
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;

      const feedingTimeoutId = window.setTimeout(() => {
        onPhaseCompleteRef.current?.('feeding');
      }, FEEDING_MS);

      timeoutIdsRef.current.push(feedingTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'collapsing') {
      setVisibleLineCount(TERMINAL_LINES.length);

      const collapseTimeoutId = window.setTimeout(() => {
        if (hasReportedCollapseCompletionRef.current) {
          return;
        }

        hasReportedCollapseCompletionRef.current = true;
        onPhaseCompleteRef.current?.('collapsing');
      }, COLLAPSE_DURATION_MS);

      timeoutIdsRef.current.push(collapseTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'bubble') {
      setVisibleLineCount(TERMINAL_LINES.length);
      hasTriggeredPhoneRef.current = false;

      const bubbleTimeoutId = window.setTimeout(() => {
        if (hasReportedBubbleCompletionRef.current) {
          return;
        }

        hasReportedBubbleCompletionRef.current = true;
        onPhaseCompleteRef.current?.('bubble');
      }, BUBBLE_SETTLE_MS);

      timeoutIdsRef.current.push(bubbleTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'connectingToPhone') {
      setVisibleLineCount(TERMINAL_LINES.length);

      const handoffTimeoutId = window.setTimeout(() => {
        if (!hasTriggeredPhoneRef.current) {
          hasTriggeredPhoneRef.current = true;
          onPhoneTriggerRef.current?.();
        }

        onPhaseCompleteRef.current?.('connectingToPhone');
      }, CONNECT_TO_PHONE_MS);

      timeoutIdsRef.current.push(handoffTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'handoffToPhone') {
      setVisibleLineCount(TERMINAL_LINES.length);
      return undefined;
    }

    setVisibleLineCount(0);
    hasReportedBubbleCompletionRef.current = false;
    hasTriggeredPhoneRef.current = false;
    hasReportedRunCompletionRef.current = false;
    hasReportedCollapseCompletionRef.current = false;

    let elapsedDelay = 0;

    TERMINAL_LINES.forEach((line, index) => {
      elapsedDelay += line.delay;

      const timeoutId = window.setTimeout(() => {
        setVisibleLineCount(index + 1);
      }, elapsedDelay);

      timeoutIdsRef.current.push(timeoutId);
    });

    const completionTimeoutId = window.setTimeout(() => {
      if (hasReportedRunCompletionRef.current) {
        return;
      }

      hasReportedRunCompletionRef.current = true;
      onPhaseCompleteRef.current?.('running');
    }, elapsedDelay + COMPLETE_PAUSE_MS);

    timeoutIdsRef.current.push(completionTimeoutId);

    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, [phase]);

  useEffect(() => {
    if (!outputRef.current || visibleLineCount === 0) {
      return;
    }

    outputRef.current.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [visibleLineCount]);

  if (phase === 'hidden') {
    return null;
  }

  if (!layout) {
    return null;
  }

  const measuredTerminalWidth = renderedTerminalWidth ?? layout.terminalWidth;
  const gapCenterX = layout.phoneLeft / 2;
  const terminalLeft = gapCenterX - measuredTerminalWidth * TERMINAL_GAP_CENTERING_FACTOR;
  const introStyle = {
    '--intro-terminal-width': `${Math.round(layout.terminalWidth)}px`,
    left: `${terminalLeft}px`,
    top: `${layout.terminalCenterY}px`,
  };

  return (
    <aside
      aria-label="Scripted risk simulation terminal"
      className={`intro-terminal intro-terminal--${phase}`}
      ref={rootRef}
      style={introStyle}
    >
      <div className="intro-terminal__source-layer">
        <div className="intro-terminal__source-strip">
          {SOURCE_FEEDS.map((source) => (
            <div className={`intro-terminal__source-chip intro-terminal__source-chip--${source.type}`} key={source.id}>
              <span className="intro-terminal__source-label">{source.label}</span>
              <span className={`intro-terminal__source-icon intro-terminal__source-icon--${source.type}`}>
                <SourceIcon type={source.type} />
              </span>
            </div>
          ))}
        </div>

        <svg
          aria-hidden="true"
          className="intro-terminal__connectors"
          preserveAspectRatio="none"
          viewBox="0 0 240 120"
        >
          <path
            className="intro-terminal__connector-path intro-terminal__connector-path--sensor"
            d="M38 82 L58 120"
            pathLength="1"
          />
          <path
            className="intro-terminal__connector-path intro-terminal__connector-path--weather"
            d="M120 82 L120 120"
            pathLength="1"
          />
          <path
            className="intro-terminal__connector-path intro-terminal__connector-path--satellite"
            d="M202 82 L182 120"
            pathLength="1"
          />
        </svg>
      </div>

      {phoneConnectorPath ? (
        <svg aria-hidden="true" className="intro-terminal__phone-connector" preserveAspectRatio="none">
          <path className="intro-terminal__phone-connector-path" d={phoneConnectorPath} pathLength="1" />
        </svg>
      ) : null}

      <div className="intro-terminal__window">
        <div className="intro-terminal__shell">
          <header className="intro-terminal__topbar">
            <div aria-hidden="true" className="intro-terminal__dots">
              <span className="intro-terminal__dot intro-terminal__dot--red" />
              <span className="intro-terminal__dot intro-terminal__dot--amber" />
              <span className="intro-terminal__dot intro-terminal__dot--green" />
            </div>
            <div className="intro-terminal__title-group">
              <p className="intro-terminal__title">risk-sim.sh</p>
              <p className="intro-terminal__subtitle">Unite pitch replay</p>
            </div>
            <span className={`intro-terminal__status intro-terminal__status--${phase}`}>
              {getStatusCopy(phase)}
            </span>
          </header>

          <div className="intro-terminal__body">
            <div className="intro-terminal__bootline">
              <span className="intro-terminal__prompt-label">unite@edge</span>
              <span className="intro-terminal__prompt-path">~/sim</span>
              <span className="intro-terminal__prompt-command">./risk-sim.sh --field vineyard_north</span>
            </div>

            <div aria-live="polite" className="intro-terminal__output" ref={outputRef}>
              {TERMINAL_LINES.slice(0, visibleLineCount).map((line) => (
                <p className={`intro-terminal__line intro-terminal__line--${line.tag}`} key={line.id}>
                  <span className="intro-terminal__tag">[{line.tag}]</span>
                  <span className="intro-terminal__text">{line.text}</span>
                </p>
              ))}

              {phase === 'visible' || phase === 'sources' || phase === 'feeding' || phase === 'running' ? (
                <div className="intro-terminal__cursor-row" aria-hidden="true">
                  <span className="intro-terminal__cursor-label">_</span>
                  <span className="intro-terminal__cursor" />
                </div>
              ) : null}
            </div>
          </div>

          <footer className="intro-terminal__footer">
            <p>{getFooterCopy(phase)}</p>
          </footer>
        </div>

        <div aria-hidden="true" className="intro-terminal__core">
          <span className="intro-terminal__core-ring" />
          <span className="intro-terminal__core-dot" />
        </div>
      </div>
    </aside>
  );
}

export default IntroTerminal;
