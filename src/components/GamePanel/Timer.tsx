import React from 'react';

interface ClockTimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
}

export function ClockTimer({ timeLeft, totalTime, size = 200 }: ClockTimerProps) {
  const radius = size / 2 - 5;
  const tickLength = 10;

  // Store initial timeLeft value to determine tick behavior
  const initialTimeLeft = React.useRef(timeLeft);

  const getColor = (percentage: number) => {
    if (percentage >= 0.75) {
      const red = Math.round(255 * (1 - (percentage - 0.75) * 4));
      return `rgb(${red}, 255, 0)`;
    } else if (percentage >= 0.5) {
      const green = Math.round(255 - (0.75 - percentage) * 4 * 90);
      return `rgb(255, ${green}, 0)`;
    } else if (percentage >= 0.25) {
      const green = Math.round(165 * (percentage - 0.25) * 4);
      return `rgb(255, ${green}, 0)`;
    }
    return 'rgb(255, 0, 0)';
  };

  const renderTicks = () => {
    const timeLeftPercentage = timeLeft / totalTime;
    const currentColor = getColor(timeLeftPercentage);

    // Determine tick removal behavior based on initial time
    const tickStep = initialTimeLeft.current === 60 ? 2 : 1;
    const activeTicks = Math.ceil(timeLeft * tickStep);

    return Array.from({ length: totalTime }, (_, index) => {
      const angle = (index * 360) / totalTime;
      const isActive = index < activeTicks;

      if (!isActive) return null;

      return (
        <line
          key={index}
          x1={radius * Math.sin((angle * Math.PI) / 180)}
          y1={-radius * Math.cos((angle * Math.PI) / 180)}
          x2={(radius - tickLength) * Math.sin((angle * Math.PI) / 180)}
          y2={-(radius - tickLength) * Math.cos((angle * Math.PI) / 180)}
          stroke={currentColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    });
  };

  const timeLeftPercentage = timeLeft / totalTime;
  const textColor = getColor(timeLeftPercentage);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2 - 25} ${-size / 2 - 45} ${size + 50} ${size + 50}`}
    >
      <circle r={radius - 2} fill="none" stroke="var(--clock-inner)" strokeWidth="15" />
      <circle r={radius + 5} fill="none" stroke="var(--clock-outer)" strokeWidth="5" />

      {renderTicks()}

      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={size / 2}
        className="font-mono"
      >
        {timeLeft}
      </text>
    </svg>
  );
}