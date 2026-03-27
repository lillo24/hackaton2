import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PhoneFrame.css';

const STARTUP_VIBRATION_MS = 720;
const STARTUP_UNLOCK_MS = 420;

function formatLockTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatLockDate(date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function toSentenceCase(value) {
  if (!value) {
    return 'Priority';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildStartupNotification(alert) {
  if (!alert) {
    return {
      severity: 'critical',
      severityLabel: 'Critical alert',
      title: 'Priority field alert ready for review',
    };
  }

  return {
    severity: alert.severity,
    severityLabel: `${toSentenceCase(alert.severity)} alert`,
    title: alert.title,
  };
}

const PhoneFrame = forwardRef(function PhoneFrame({
  children,
  startupAlert = null,
  enableStartupSequence = false,
  startupShouldBegin = false,
  startupSequenceKey = 0,
  onStartupSequenceComplete,
}, ref) {
  const location = useLocation();
  const navigate = useNavigate();
  const [startupPhase, setStartupPhase] = useState(enableStartupSequence ? 'off' : 'app');
  const [lockDate, setLockDate] = useState(() => new Date());
  const hasActiveSequenceRef = useRef(false);
  const hasReportedCompletionRef = useRef(false);
  const notification = useMemo(() => buildStartupNotification(startupAlert), [startupAlert]);
  const isStartupActive = startupPhase !== 'app';
  const isLockScreenVisible = startupPhase === 'lockscreen' || startupPhase === 'unlocking';
  const isAppVisible = startupPhase === 'unlocking' || startupPhase === 'app';

  useEffect(() => {
    hasReportedCompletionRef.current = false;

    if (!enableStartupSequence) {
      hasActiveSequenceRef.current = false;
      setStartupPhase('app');
      return undefined;
    }

    hasActiveSequenceRef.current = true;
    setLockDate(new Date());
    setStartupPhase('off');
  }, [enableStartupSequence, startupSequenceKey]);

  useEffect(() => {
    if (startupPhase !== 'vibrating') {
      return undefined;
    }

    const lockScreenTimer = setTimeout(() => {
      setLockDate(new Date());
      setStartupPhase('lockscreen');
    }, STARTUP_VIBRATION_MS);

    return () => clearTimeout(lockScreenTimer);
  }, [startupPhase]);

  useEffect(() => {
    if (!enableStartupSequence || !startupShouldBegin || startupPhase !== 'off') {
      return;
    }

    setStartupPhase('vibrating');
  }, [enableStartupSequence, startupPhase, startupShouldBegin]);

  useEffect(() => {
    if (startupPhase !== 'unlocking') {
      return undefined;
    }

    const unlockTimer = setTimeout(() => {
      setStartupPhase('app');
    }, STARTUP_UNLOCK_MS);

    return () => clearTimeout(unlockTimer);
  }, [startupPhase]);

  useEffect(() => {
    if (startupPhase !== 'app' || !hasActiveSequenceRef.current || hasReportedCompletionRef.current) {
      return;
    }

    hasActiveSequenceRef.current = false;
    hasReportedCompletionRef.current = true;
    onStartupSequenceComplete?.();
  }, [onStartupSequenceComplete, startupPhase]);

  function handleOpenNotification() {
    if (startupPhase !== 'lockscreen') {
      return;
    }

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }

    setStartupPhase('unlocking');
  }

  return (
    <div className={`phone-body${startupPhase === 'vibrating' ? ' phone-body--vibrating' : ''}`} ref={ref}>
      <div className="phone-bezel">
        <div className={`phone-screen${isStartupActive ? ` phone-screen--${startupPhase}` : ''}`}>
          <div
            className={`phone-content${
              isAppVisible ? ' phone-content--visible' : ' phone-content--hidden'
            }${startupPhase === 'unlocking' ? ' phone-content--revealing' : ''}`}
          >
            {children}
          </div>

          {isStartupActive ? (
            <div className={`phone-startup phone-startup--${startupPhase}`}>
              {isLockScreenVisible ? (
                <div className={`phone-lockscreen${startupPhase === 'unlocking' ? ' is-unlocking' : ''}`}>
                  <div className="phone-lockscreen__content">
                    <div className="phone-lockscreen__clock-block">
                      <p className="phone-lockscreen__date">{formatLockDate(lockDate)}</p>
                      <p className="phone-lockscreen__time">{formatLockTime(lockDate)}</p>
                      <p className="phone-lockscreen__subcopy">Priority alert ready to open</p>
                    </div>

                    <button
                      aria-label="Open priority alert notification"
                      className={`phone-lockscreen__notification phone-lockscreen__notification--${notification.severity}`}
                      disabled={startupPhase !== 'lockscreen'}
                      onClick={handleOpenNotification}
                      type="button"
                    >
                      <span
                        className={`phone-lockscreen__notification-pill phone-lockscreen__notification-pill--${notification.severity}`}
                      >
                        {notification.severityLabel}
                      </span>
                      <p className="phone-lockscreen__notification-title">{notification.title}</p>
                    </button>

                    <p className="phone-lockscreen__hint">trascina su per aprire</p>
                  </div>
                </div>
              ) : (
                <div aria-hidden="true" className="phone-sleep" />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default PhoneFrame;
