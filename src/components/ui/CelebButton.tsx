import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const CelebButton = ({ children, autoTrigger = false, autoDelay = 2000 }) => {
  // Function to trigger the confetti explosion
  const fireConfetti = (origin = { x: 0.5, y: 0.5 }) => {
    const fire = (particleRatio, opts) => {
      confetti(
        Object.assign({}, { disableForReducedMotion: true }, opts, {
          particleCount: Math.floor(200 * particleRatio),
        })
      );
    };

    fire(0.25, { spread: 26, startVelocity: 55, origin });
    fire(0.2, { spread: 60, origin });
    fire(0.35, { spread: 100, decay: 0.91, origin });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, origin });
    fire(0.1, { spread: 120, startVelocity: 45, origin });
  };

  // Trigger confetti automatically if `autoTrigger` is true
  useEffect(() => {
    if (autoTrigger) {
      const timer = setTimeout(() => {
        fireConfetti(); // Center of the screen
      }, autoDelay);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [autoTrigger, autoDelay]);

  return (
    <div
      onClick={() => fireConfetti()}
    >
        {children}
    </div>
  );
};

export default CelebButton;
