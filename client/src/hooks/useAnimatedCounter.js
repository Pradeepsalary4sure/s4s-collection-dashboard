import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(end, duration = 1500, enabled = true) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);
  const initialValue = 0;

  useEffect(() => {
    if (!enabled) {
      setCount(end);
      return;
    }

    setCount(initialValue);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = initialValue + (end - initialValue) * eased;

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, enabled]);

  return count;
}

