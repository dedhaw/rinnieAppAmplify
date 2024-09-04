import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const ConfettiAnimation: React.FC<{ run: boolean }> = ({ run }) => {
  useEffect(() => {
    if (run) {
      const animation = confetti.create(undefined, {
        resize: true,
        useWorker: true,
      });

      // Trigger confetti burst
      const triggerConfetti = () => {
        animation({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff914b", "#92CBF7"],
        });
      };

      triggerConfetti();

      // Optionally, clear confetti after a delay
      const clearConfetti = setTimeout(() => {
        animation({
          particleCount: 0,
        });
      }, 5000); // Adjust time as needed

      return () => clearTimeout(clearConfetti);
    }
  }, [run]);

  return (
    <canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default ConfettiAnimation;
