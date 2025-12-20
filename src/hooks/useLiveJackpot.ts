import { useState, useEffect } from 'react';

/**
 * Live Jackpot Hook
 * Simulates a live-updating jackpot counter that ticks up
 * Creates urgency and "live casino floor" feeling
 */
export const useLiveJackpot = (initialValue: number, speed = 0.01) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a random "tick" up to make it look like people are playing
      const increment = Math.random() * speed;
      setValue((prev) => prev + increment);
    }, 2000); // Ticks every 2 seconds

    return () => clearInterval(interval);
  }, [speed]);

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

