import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiPlay, FiPause, FiSquare, FiRotateCcw, FiClock, FiGlobe } from 'react-icons/fi';
import styles from './Clock.module.scss';

/**
 * Modern Clock Component
 * 
 * Features:
 * - Live time display with customizable format
 * - Multiple timezone support
 * - Accessible controls with ARIA labels
 * - Modern design with theme support
 * - Responsive layout
 * - Performance optimized with proper cleanup
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showDate - Show date along with time
 * @param {boolean} props.showSeconds - Include seconds in time display
 * @param {string} props.format - Time format: '12' or '24' hour
 * @param {number} props.updateInterval - Update interval in milliseconds
 * @param {string} props.timezone - Timezone (default: 'local')
 * @param {boolean} props.showControls - Show start/stop/reset controls
 * @param {boolean} props.showTimezone - Show timezone selector
 * @param {Function} props.onTick - Callback function called on each tick
 * @param {string} props.className - Additional CSS classes
 */
const Clock = ({
  showDate = true,
  showSeconds = true,
  format = '12',
  updateInterval = 1000,
  timezone = 'local',
  showControls = true,
  showTimezone = false,
  onTick = null,
  className = '',
  ...props
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);
  
  const timerRef = useRef(null);
  const onTickRef = useRef(onTick);

  // Keep callback reference current
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Available timezones for selector
  const timezones = useMemo(() => [
    { value: 'local', label: 'Local Time' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'America/Chicago', label: 'Chicago' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Australia/Sydney', label: 'Sydney' }
  ], []);

  // Update time and call callback
  const tick = useCallback(() => {
    const newTime = new Date();
    setCurrentTime(newTime);
    
    if (onTickRef.current) {
      onTickRef.current(newTime);
    }
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  // Reset to current time
  const resetClock = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  // Toggle timer state
  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Handle timezone change
  const handleTimezoneChange = useCallback((event) => {
    setSelectedTimezone(event.target.value);
  }, []);

  // Format time based on props
  const formatTime = useCallback((date) => {
    const options = {
      hour12: format === '12',
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      ...(selectedTimezone !== 'local' && { timeZone: selectedTimezone })
    };

    return date.toLocaleTimeString([], options);
  }, [format, showSeconds, selectedTimezone]);

  // Format date
  const formatDate = useCallback((date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(selectedTimezone !== 'local' && { timeZone: selectedTimezone })
    };

    return date.toLocaleDateString([], options);
  }, [selectedTimezone]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(tick, updateInterval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, updateInterval, tick]);

  // Initial tick
  useEffect(() => {
    tick();
  }, [tick]);

  const formattedTime = formatTime(currentTime);
  const formattedDate = showDate ? formatDate(currentTime) : null;
  const currentTimezone = selectedTimezone === 'local' ? 'Local' : selectedTimezone;

  return (
    <div 
      className={`${styles.clock} ${className}`}
      role="timer"
      aria-label="Digital clock"
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      {/* Main Display */}
      <div className={styles.display}>
        {showDate && (
          <div 
            className={styles.date}
            aria-label={`Current date: ${formattedDate}`}
          >
            {formattedDate}
          </div>
        )}
        
        <div 
          className={styles.time}
          aria-label={`Current time: ${formattedTime}`}
        >
          {formattedTime}
        </div>

        <div className={styles.status}>
          <div 
            className={styles.statusIndicator}
            data-running={isRunning}
            aria-hidden="true"
          />
          <span aria-label={`Clock is ${isRunning ? 'running' : 'stopped'}`}>
            {isRunning ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className={styles.controls} role="group" aria-label="Clock controls">
          <button
            onClick={toggleTimer}
            className={styles.controlButton}
            data-variant={isRunning ? 'danger' : 'success'}
            aria-label={isRunning ? 'Pause clock' : 'Start clock'}
            data-seo-element="clock-toggle"
          >
            {isRunning ? <FiPause className={styles.buttonIcon} aria-hidden="true" /> : <FiPlay className={styles.buttonIcon} aria-hidden="true" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={stopTimer}
            className={styles.controlButton}
            aria-label="Stop clock"
            disabled={!isRunning}
            data-seo-element="clock-stop"
          >
            <FiSquare className={styles.buttonIcon} aria-hidden="true" />
            Stop
          </button>
          
          <button
            onClick={resetClock}
            className={styles.controlButton}
            aria-label="Reset clock to current time"
            data-seo-element="clock-reset"
          >
            <FiRotateCcw className={styles.buttonIcon} aria-hidden="true" />
            Reset
          </button>
        </div>
      )}

      {/* Timezone Selector */}
      {showTimezone && (
        <div className={styles.timezoneSelector}>
          <label htmlFor="timezone-select" className={styles.timezoneLabel}>
            <FiGlobe aria-hidden="true" />
            Timezone:
          </label>
          <select
            id="timezone-select"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            className={styles.timezoneSelect}
            aria-label="Select timezone"
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clock Info */}
      <div className={styles.info} aria-label="Clock settings">
        <span className={styles.infoBadge}>
          <FiClock aria-hidden="true" />
          {format === '12' ? '12-hour' : '24-hour'}
        </span>
        <span className={styles.infoBadge}>
          Updates: {updateInterval}ms
        </span>
        <span className={styles.infoBadge}>
          <FiGlobe aria-hidden="true" />
          {currentTimezone}
        </span>
      </div>
    </div>
  );
};

// Enhanced reusable timer hook with better performance
export const useTimer = (callback, interval = 1000, autoStart = false) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Keep callback current
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    stop();
    if (callbackRef.current) {
      callbackRef.current();
    }
  }, [stop]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, interval]);

  return { start, stop, toggle, reset, isRunning };
};

// Modern Stopwatch component
export const Stopwatch = ({ className = '', ...props }) => {
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);

  const { toggle, reset: resetTimer, isRunning } = useTimer(() => {
    setTime(prev => prev + 10);
  }, 10);

  const reset = useCallback(() => {
    resetTimer();
    setTime(0);
    setLaps([]);
  }, [resetTimer]);

  const addLap = useCallback(() => {
    if (isRunning && time > 0) {
      setLaps(prev => [...prev, time]);
    }
  }, [isRunning, time]);

  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div 
      className={`${styles.stopwatch} ${className}`}
      role="timer"
      aria-label="Stopwatch"
      {...props}
    >
      <div className={styles.display}>
        <div 
          className={styles.stopwatchDisplay}
          aria-label={`Stopwatch time: ${formatTime(time)}`}
          aria-live="polite"
        >
          {formatTime(time)}
        </div>

        <div className={styles.status}>
          <div 
            className={styles.statusIndicator}
            data-running={isRunning}
            aria-hidden="true"
          />
          <span>
            {isRunning ? 'Running' : time > 0 ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>

      <div className={styles.stopwatchControls} role="group" aria-label="Stopwatch controls">
        <button
          onClick={toggle}
          className={styles.controlButton}
          data-variant={isRunning ? 'danger' : 'success'}
          aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
        >
          {isRunning ? <FiPause className={styles.buttonIcon} aria-hidden="true" /> : <FiPlay className={styles.buttonIcon} aria-hidden="true" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={addLap}
          disabled={!isRunning}
          className={styles.controlButton}
          data-variant="primary"
          aria-label="Record lap time"
        >
          <FiClock className={styles.buttonIcon} aria-hidden="true" />
          Lap
        </button>
        
        <button
          onClick={reset}
          className={styles.controlButton}
          aria-label="Reset stopwatch"
        >
          <FiRotateCcw className={styles.buttonIcon} aria-hidden="true" />
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className={styles.laps}>
          <h3 className={styles.lapsHeader}>
            Lap Times ({laps.length})
          </h3>
          <div 
            className={styles.lapsList}
            role="log"
            aria-label="Lap times list"
          >
            {laps.map((lapTime, index) => (
              <div 
                key={index} 
                className={styles.lap}
                role="listitem"
              >
                <span className={styles.lapIndex}>
                  Lap {index + 1}
                </span>
                <span className={styles.lapTime}>
                  {formatTime(lapTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;