import { useEffect } from "react";

export default function useClickOutside(ref, callback) {
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target)) {
        callback();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ref, callback]);
}