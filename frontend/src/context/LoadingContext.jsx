import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import LoadingSplash from '../components/LoadingSplash';

const LoadingContext = createContext(null);

// Threshold duration: Only show splash screen if request takes longer than 750ms
const SPLASH_DELAY_MS = 750;

let activeRequests = 0;
let splashTimer = null;
let progressInterval = null;
let globalStartHandler = null;
let globalStopHandler = null;

export const triggerGlobalLoading = (msg) => {
  if (globalStartHandler) globalStartHandler(msg);
};

export const completeGlobalLoading = () => {
  if (globalStopHandler) globalStopHandler();
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Fetching data from database...');
  const progressRef = useRef(0);
  const isSplashActiveRef = useRef(false);

  const startProgressAnimation = useCallback((msg = 'Fetching data from database...') => {
    activeRequests++;
    setMessage(msg);

    if (activeRequests === 1) {
      if (splashTimer) clearTimeout(splashTimer);
      if (progressInterval) clearInterval(progressInterval);

      // Only mount/show the splash screen when loading time is "big" (exceeds threshold)
      splashTimer = setTimeout(() => {
        isSplashActiveRef.current = true;
        setIsLoading(true);
        progressRef.current = 15;
        setProgress(15);

        progressInterval = setInterval(() => {
          if (progressRef.current < 60) {
            progressRef.current += Math.floor(Math.random() * 6) + 4; // +4 to +9
          } else if (progressRef.current < 85) {
            progressRef.current += Math.floor(Math.random() * 3) + 2; // +2 to +4
          } else if (progressRef.current < 94) {
            progressRef.current += 1;
          }
          setProgress(Math.min(94, progressRef.current));
        }, 50);
      }, SPLASH_DELAY_MS);
    }
  }, []);

  const finishProgressAnimation = useCallback(() => {
    activeRequests = Math.max(0, activeRequests - 1);

    if (activeRequests === 0) {
      // If requests finished before threshold, cancel the splash timer completely
      if (splashTimer) {
        clearTimeout(splashTimer);
        splashTimer = null;
      }

      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      // If the splash screen actually became visible, show 100% and cleanly dissolve out
      if (isSplashActiveRef.current) {
        progressRef.current = 100;
        setProgress(100);

        setTimeout(() => {
          if (activeRequests === 0) {
            setIsLoading(false);
            setProgress(0);
            progressRef.current = 0;
            isSplashActiveRef.current = false;
          }
        }, 220);
      } else {
        // Fast request: was never shown, reset state cleanly
        setIsLoading(false);
        setProgress(0);
        progressRef.current = 0;
      }
    }
  }, []);

  // Register global handlers for Axios interceptors
  globalStartHandler = startProgressAnimation;
  globalStopHandler = finishProgressAnimation;

  // Manual wrapper for any custom async await
  const withLoading = useCallback(
    async (asyncFn, customMsg) => {
      startProgressAnimation(customMsg);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        finishProgressAnimation();
      }
    },
    [startProgressAnimation, finishProgressAnimation]
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        message,
        startLoading: startProgressAnimation,
        stopLoading: finishProgressAnimation,
        withLoading,
      }}
    >
      {children}
      {isLoading && <LoadingSplash progress={progress} delay={0} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
