import { useState, useEffect, useRef } from 'react';

type TickDirection = 'up' | 'down' | 'neutral';

export const useBiologicalTick = (value: number) => {
  const [direction, setDirection] = useState<TickDirection>('neutral');
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prev = prevValueRef.current;
    
    // Threshold to ignore insignificant noise (micro-fluctuations)
    const threshold = value * 0.0001; // 0.01% change required to trigger
    const diff = value - prev;

    if (Math.abs(diff) > threshold) {
      if (value > prev) {
        setDirection('up');
        // Extended persistence: 2000ms allows the user to actually "see" the green
        const timer = setTimeout(() => setDirection('neutral'), 2000);
        return () => clearTimeout(timer);
      } else if (value < prev) {
        setDirection('down');
        // Fear lingers longer: 3000ms for red updates
        const timer = setTimeout(() => setDirection('neutral'), 3000);
        return () => clearTimeout(timer);
      }
    }
    
    prevValueRef.current = value;
  }, [value]);

  return direction;
};