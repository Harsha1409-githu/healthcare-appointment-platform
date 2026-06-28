import { useEffect, useRef, useState } from "react";

export default function usePullToRefresh(onRefresh) {
  const startY = useRef(0);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (window.scrollY !== 0) return;

      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const onTouchMove = (e) => {
      if (!pulling.current || window.scrollY !== 0) return;

      const distance = e.touches[0].clientY - startY.current;

      if (distance > 0) {
        setPullDistance(Math.min(distance, 90));
      }
    };

    const onTouchEnd = async () => {
      if (!pulling.current) return;

      pulling.current = false;

      if (pullDistance > 70) {
        try {
          setRefreshing(true);
          await onRefresh?.();
        } finally {
          setRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, pullDistance]);

  return {
    pullDistance,
    refreshing,
    visible: pullDistance > 10 || refreshing,
  };
}