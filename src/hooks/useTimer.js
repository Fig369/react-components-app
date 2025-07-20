import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for managing interval-based timers
 * Provides start, stop, toggle functionality with cleanup
 * 
 * @param {Function} callback - Function to call on each interval
 * @param {number} interval - Interval in milliseconds (default: 1000)
 * @param {boolean} immediate - Whether to start immediately (default: false)
 * @returns {Object} Timer controls and state
 */
export const useTimer = (callback, interval = 1000, immediate = false) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [tickCount, setTickCount] = useState(0);

  // Keep callback current
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Start timer
  const start = useCallback(() => {
    if (!isRunning && !timerRef.current) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        callbackRef.current();
        setTickCount(prev => prev + 1);
      }, interval);
    }
  }, [isRunning, interval]);

  // Stop timer
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  }, []);

  // Reset timer and tick count
  const reset = useCallback(() => {
    stop();
    setTickCount(0);
  }, [stop]);

  // Toggle timer state
  const toggle = useCallback(() => {
    isRunning ? stop() : start();
  }, [isRunning, start, stop]);

  // Start immediately if requested
  useEffect(() => {
    if (immediate) {
      start();
    }
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [immediate, start]);

  return {
    // State
    isRunning,
    tickCount,
    
    // Controls
    start,
    stop,
    reset,
    toggle
  };
};

/**
 * Custom hook for countdown timer
 * Counts down from initial time to zero
 * 
 * @param {number} initialTime - Initial time in seconds
 * @param {Function} onComplete - Callback when countdown reaches zero
 * @param {number} interval - Update interval in milliseconds (default: 1000)
 * @returns {Object} Countdown state and controls
 */
export const useCountdown = (initialTime, onComplete, interval = 1000) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const callback = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setIsCompleted(true);
        if (onComplete) onComplete();
        return 0;
      }
      return prev - 1;
    });
  }, [onComplete]);
  
  const { isRunning, start, stop, reset: timerReset, toggle } = useTimer(callback, interval);
  
  const reset = useCallback(() => {
    timerReset();
    setTimeLeft(initialTime);
    setIsCompleted(false);
  }, [timerReset, initialTime]);
  
  const setTime = useCallback((newTime) => {
    setTimeLeft(newTime);
    setIsCompleted(false);
  }, []);
  
  return {
    timeLeft,
    isRunning,
    isCompleted,
    start,
    stop,
    reset,
    toggle,
    setTime
  };
};

/**
 * Custom hook for stopwatch functionality
 * Counts up from zero
 * 
 * @param {number} interval - Update interval in milliseconds (default: 10)
 * @returns {Object} Stopwatch state and controls
 */
export const useStopwatch = (interval = 10) => {
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  
  const callback = useCallback(() => {
    setTime(prev => prev + interval);
  }, [interval]);
  
  const { isRunning, start, stop, reset: timerReset, toggle } = useTimer(callback, interval);
  
  const reset = useCallback(() => {
    timerReset();
    setTime(0);
    setLaps([]);
  }, [timerReset]);
  
  const lap = useCallback(() => {
    setLaps(prev => [...prev, time]);
  }, [time]);
  
  const formatTime = useCallback((milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    time,
    formattedTime: formatTime(time),
    laps: laps.map(lapTime => ({ time: lapTime, formatted: formatTime(lapTime) })),
    isRunning,
    start,
    stop,
    reset,
    toggle,
    lap
  };
};

export default useTimer;