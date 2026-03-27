import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import IntroTerminal from '../components/IntroTerminal';
import PhoneFrame from '../components/PhoneFrame';
import RoadmapPresentation from './RoadmapPresentation';
import './AppShell.css';

const INTRO_TERMINAL_MAX_WIDTH = 620;
const INTRO_TERMINAL_MIN_WIDTH = 300;
const DESKTOP_ASSISTANT_INTRO_DURATION_MS = 1680;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// The intro overlay is measured from the actual rendered phone position so the phone
// can stay centered while the terminal lands in the real left gap.
function buildPitchIntroLayout(stageNode, phoneNode) {
  const stageRect = stageNode.getBoundingClientRect();
  const phoneRect = phoneNode.getBoundingClientRect();

  if (!stageRect.width || !stageRect.height || !phoneRect.width || !phoneRect.height) {
    return null;
  }

  const phoneLeft = phoneRect.left - stageRect.left;
  const phoneCenterY = phoneRect.top - stageRect.top + phoneRect.height / 2;
  const leftGapWidth = Math.max(phoneLeft, 0);
  const phoneTriggerX = phoneLeft + Math.min(24, phoneRect.width * 0.08);
  const phoneTriggerY = phoneCenterY - Math.min(20, phoneRect.height * 0.035);
  // Prefer the measured left-gap fit, but keep a readable fallback width on cramped stages.
  const terminalFittedWidth = Math.min(INTRO_TERMINAL_MAX_WIDTH, Math.max(leftGapWidth - 24, 0));
  const terminalMinimumWidth = Math.min(INTRO_TERMINAL_MIN_WIDTH, Math.max(leftGapWidth - 24, 220));
  const terminalWidth = Math.max(terminalFittedWidth, terminalMinimumWidth);
  const terminalCenterY = clamp(
    phoneCenterY - Math.min(48, phoneRect.height * 0.08),
    182,
    stageRect.height - 172,
  );

  return {
    leftGapWidth,
    phoneCenterY,
    phoneLeft,
    phoneTriggerX,
    phoneTriggerY,
    stageLeft: stageRect.left,
    stageTop: stageRect.top,
    stageHeight: stageRect.height,
    stageWidth: stageRect.width,
    terminalCenterY,
    terminalWidth,
  };
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/alerts', label: 'Segnalazioni', icon: 'alerts', end: true },
  { to: '/alert', label: 'Dettaglio', icon: 'alert', end: true },
];

const previewModes = [
  { id: 'phone', label: 'Telefono' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'roadmap', label: 'Roadmap' },
];
const previewModeIds = new Set(previewModes.map((mode) => mode.id));

function resolvePreviewMode(modeParam) {
  return previewModeIds.has(modeParam) ? modeParam : 'phone';
}

function NavIcon({ icon }) {
  if (icon === 'dashboard') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <rect height="7" rx="2" width="7" x="3" y="3" />
        <rect height="7" rx="2" width="11" x="10" y="3" />
        <rect height="11" rx="2" width="7" x="3" y="10" />
        <rect height="11" rx="2" width="11" x="10" y="10" />
      </svg>
    );
  }

  if (icon === 'alerts') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <path d="M4 7.5h16" />
        <path d="M4 12h11" />
        <path d="M4 16.5h14" />
      </svg>
    );
  }

  if (icon === 'alert') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.2L5.3 15c-.4.5 0 1.2.6 1.2h12.2c.6 0 1-.7.6-1.2l-1.4-1.8a3.6 3.6 0 0 1-.8-2.2V8.5A4.5 4.5 0 0 0 12 4Z" />
        <path d="M10.4 18.2a1.8 1.8 0 0 0 3.2 0" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6.8 18a5.2 5.2 0 0 1 10.4 0" />
    </svg>
  );
}

function PreviewApp({ previewMode }) {
  const location = useLocation();
  const contentRef = useRef(null);
  const contentClassName = `mobile-app__content${location.pathname === '/alerts' ? ' mobile-app__content--alerts' : ''}`;
  const modeSearch = `?mode=${previewMode}`;

  useLayoutEffect(() => {
    const contentNode = contentRef.current;

    if (!contentNode || location.pathname === '/alerts') {
      return;
    }

    contentNode.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`mobile-app mobile-app--${previewMode}`}>
      <main className={contentClassName} ref={contentRef}>
        <Outlet />
      </main>

      <nav className="mobile-app__nav" aria-label="Principale" style={{ '--mobile-app-nav-columns': navItems.length }}>
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => `mobile-app__nav-link${isActive ? ' is-active' : ''}`}
            end={item.end}
            key={item.to}
            to={{ pathname: item.to, search: modeSearch }}
          >
            <NavIcon icon={item.icon} />
            <span className="mobile-app__nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function AppShell({ alerts = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stageRef = useRef(null);
  const phoneFrameRef = useRef(null);
  const [previewMode, setPreviewMode] = useState(() => resolvePreviewMode(searchParams.get('mode')));
  const [hasPlayedDesktopAssistantIntro, setHasPlayedDesktopAssistantIntro] = useState(false);
  const [isDesktopAssistantIntroRunning, setIsDesktopAssistantIntroRunning] = useState(false);
  const [startupSequencePending, setStartupSequencePending] = useState(
    location.pathname === '/' || location.pathname === '/dashboard',
  );
  const [phoneStartupShouldBegin, setPhoneStartupShouldBegin] = useState(false);
  const [startupSequenceKey, setStartupSequenceKey] = useState(0);
  const [terminalPhase, setTerminalPhase] = useState('hidden');
  const [introLayout, setIntroLayout] = useState(null);
  const phonePreviewApp = <PreviewApp previewMode="phone" />;
  const desktopPreviewApp = <PreviewApp previewMode="desktop" />;
  const isRoadmap = previewMode === 'roadmap';
  const isPhonePreview = previewMode === 'phone';
  const isDesktopPreview = previewMode === 'desktop';
  const isDashboardRoute = location.pathname === '/dashboard';
  const startupAlert = alerts[0] ?? null;
  const shouldHoldIntroStage = isPhonePreview && isDashboardRoute && startupSequencePending;
  const shouldQueueTerminalIntro = shouldHoldIntroStage && !phoneStartupShouldBegin;
  const isTerminalIntroActive = isPhonePreview && isDashboardRoute && terminalPhase !== 'hidden';
  const canStartTerminalSequence = shouldQueueTerminalIntro && terminalPhase === 'visible';

  useEffect(() => {
    setPreviewMode(resolvePreviewMode(searchParams.get('mode')));
  }, [searchParams]);

  useEffect(() => {
    if (!isDesktopPreview || hasPlayedDesktopAssistantIntro) {
      return undefined;
    }

    setHasPlayedDesktopAssistantIntro(true);
    setIsDesktopAssistantIntroRunning(true);

    const timeoutId = window.setTimeout(() => {
      setIsDesktopAssistantIntroRunning(false);
    }, DESKTOP_ASSISTANT_INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasPlayedDesktopAssistantIntro, isDesktopPreview]);

  useEffect(() => {
    if (isDesktopPreview || !isDesktopAssistantIntroRunning) {
      return;
    }

    setIsDesktopAssistantIntroRunning(false);
  }, [isDesktopAssistantIntroRunning, isDesktopPreview]);

  function updatePreviewMode(nextMode) {
    setPreviewMode(nextMode);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set('mode', nextMode);
      return nextParams;
    });
  }

  useLayoutEffect(() => {
    if (!isPhonePreview) {
      setIntroLayout(null);
      return undefined;
    }

    const stageNode = stageRef.current;
    const phoneNode = phoneFrameRef.current;

    if (!stageNode || !phoneNode) {
      return undefined;
    }

    let frameId = 0;

    const measureLayout = () => {
      frameId = 0;
      setIntroLayout(buildPitchIntroLayout(stageNode, phoneNode));
    };

    const scheduleMeasure = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(measureLayout);
    };

    scheduleMeasure();

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasure();
    });

    resizeObserver.observe(stageNode);
    resizeObserver.observe(phoneNode);
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [isPhonePreview]);

  useEffect(() => {
    if (shouldQueueTerminalIntro && terminalPhase === 'hidden') {
      setTerminalPhase('visible');
    }
  }, [shouldQueueTerminalIntro, startupSequenceKey, terminalPhase]);

  useEffect(() => {
    if (!canStartTerminalSequence) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.code !== 'Space' && event.key !== ' ') {
        return;
      }

      const target = event.target;
      const interactiveTarget =
        target instanceof Element ? target.closest('button, a, input, textarea, select, [role="button"]') : null;
      const isEditableTarget = target instanceof HTMLElement && target.isContentEditable;

      if (interactiveTarget || isEditableTarget) {
        return;
      }

      event.preventDefault();
      setTerminalPhase((currentPhase) => (currentPhase === 'visible' ? 'sources' : currentPhase));
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canStartTerminalSequence]);

  function handleReplayIntro() {
    updatePreviewMode('phone');
    setStartupSequencePending(true);
    setPhoneStartupShouldBegin(false);
    setTerminalPhase('hidden');
    setStartupSequenceKey((currentKey) => currentKey + 1);

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  }

  function handleSkipIntro() {
    setStartupSequencePending(false);
    setPhoneStartupShouldBegin(false);
    setTerminalPhase('hidden');
  }

  function handleStartTerminalSequence() {
    setTerminalPhase((currentPhase) => (currentPhase === 'visible' ? 'sources' : currentPhase));
  }

  function handleTerminalPhaseComplete(completedPhase) {
    if (completedPhase === 'sources') {
      setTerminalPhase((currentPhase) => (currentPhase === 'sources' ? 'feeding' : currentPhase));
      return;
    }

    if (completedPhase === 'feeding') {
      setTerminalPhase((currentPhase) => (currentPhase === 'feeding' ? 'running' : currentPhase));
      return;
    }

    if (completedPhase === 'running') {
      setTerminalPhase((currentPhase) => (currentPhase === 'running' ? 'collapsing' : currentPhase));
      return;
    }

    if (completedPhase === 'collapsing') {
      setTerminalPhase((currentPhase) => (currentPhase === 'collapsing' ? 'bubble' : currentPhase));
      return;
    }

    if (completedPhase === 'bubble') {
      setTerminalPhase((currentPhase) => (currentPhase === 'bubble' ? 'connectingToPhone' : currentPhase));
      return;
    }

    if (completedPhase === 'connectingToPhone') {
      setTerminalPhase((currentPhase) => (currentPhase === 'connectingToPhone' ? 'handoffToPhone' : currentPhase));
    }
  }

  function handleIntroPhoneTrigger() {
    setPhoneStartupShouldBegin(true);
  }

  function handleStartupSequenceComplete() {
    setStartupSequencePending(false);
    setPhoneStartupShouldBegin(false);
    setTerminalPhase('hidden');
  }

  return (
    <div className={`app-shell app-shell--${previewMode}`}>
      <div className={`app-shell__top-toggle${isRoadmap ? ' app-shell__top-toggle--roadmap' : ''}`}>
        <div
          aria-label="Selettore modalita anteprima"
          className={`app-shell__mode-toggle${isRoadmap ? ' app-shell__mode-toggle--roadmap' : ''}`}
          role="tablist"
        >
          {previewModes.map((mode) => {
            const isActive = previewMode === mode.id;

            return (
              <button
                aria-selected={isActive}
                className={`app-shell__mode-toggle-button${isActive ? ' is-active' : ''}`}
                key={mode.id}
                onClick={() => updatePreviewMode(mode.id)}
                role="tab"
                type="button"
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        <Link className="app-shell__utility-link app-shell__utility-link--admin" to="/admin">
          Pagina admin
        </Link>

        {isPhonePreview ? (
          <button
            className={`app-shell__intro-button${
              shouldHoldIntroStage ? ' app-shell__intro-button--skip' : ' app-shell__intro-button--replay'
            }`}
            onClick={shouldHoldIntroStage ? handleSkipIntro : handleReplayIntro}
            type="button"
          >
            {shouldHoldIntroStage ? 'Salta intro' : 'Riavvia intro'}
          </button>
        ) : null}
      </div>

      <section
        className={`app-shell__preview-stage app-shell__preview-stage--${previewMode}${
          isDesktopAssistantIntroRunning ? ' app-shell__preview-stage--desktop-assistant-intro' : ''
        }`}
      >
        {isRoadmap ? (
          <RoadmapPresentation />
        ) : (
          <div className="app-shell__preview-carousel">
            <div className="app-shell__preview-carousel-track">
              <div className="app-shell__preview-carousel-panel">
                <div
                  aria-hidden={!isPhonePreview}
                  className="app-shell__preview-card app-shell__preview-card--phone"
                  {...(!isPhonePreview ? { inert: '' } : {})}
                >
                  <div
                    ref={stageRef}
                    className={`app-shell__phone-pitch-stage${
                      canStartTerminalSequence ? ' app-shell__phone-pitch-stage--waiting' : ''
                    }`}
                    onClick={canStartTerminalSequence ? handleStartTerminalSequence : undefined}
                  >
                    <div className="app-shell__phone-pitch-phone-layer">
                      <div className="app-shell__phone-pitch-phone-shell">
                        <PhoneFrame
                          enableStartupSequence={shouldHoldIntroStage}
                          onStartupSequenceComplete={handleStartupSequenceComplete}
                          ref={phoneFrameRef}
                          startupAlert={startupAlert}
                          startupSequenceKey={startupSequenceKey}
                          startupShouldBegin={phoneStartupShouldBegin}
                        >
                          {phonePreviewApp}
                        </PhoneFrame>
                      </div>
                    </div>

                    {isTerminalIntroActive ? (
                      <div className="app-shell__phone-pitch-overlay">
                        <IntroTerminal
                          layout={introLayout}
                          onPhoneTrigger={handleIntroPhoneTrigger}
                          onPhaseComplete={handleTerminalPhaseComplete}
                          phase={terminalPhase}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="app-shell__preview-carousel-panel">
                <div
                  aria-hidden={!isDesktopPreview}
                  className="app-shell__preview-card app-shell__preview-card--desktop"
                  {...(!isDesktopPreview ? { inert: '' } : {})}
                >
                  <div className="desktop-preview-frame">{desktopPreviewApp}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AppShell;
