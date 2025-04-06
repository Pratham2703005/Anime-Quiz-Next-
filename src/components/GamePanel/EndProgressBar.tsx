import React from 'react'

const EndProgressBar = ({percentage}:{percentage:number}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
    {/* Circular Progress */}
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Background circle */}
        <circle
          className="text-slate-700/50 stroke-current"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />

        {/* Progress circle with animation */}
        <circle
          className="text-green-400 stroke-current"
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          filter="url(#glow)"
          style={{
            strokeDasharray: `${2 * Math.PI * 45}`,
            strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}`,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 1.5s ease-in-out",
          }}
        />

        {/* Percentage text */}
        <text x="50" y="60" className="text-4xl font-bold" fill="currentColor" textAnchor="middle">
          {percentage}%
        </text>
      </svg>
    </div>

    <p className="text-center font-medium text-indigo-300 mt-4 max-w-xs">
      {percentage >= 90
        ? "Exceptional performance! You're a master!"
        : percentage >= 75
          ? "Great work! You've performed very well!"
          : percentage >= 50
            ? "Good job! You've mastered the basics!"
            : "Keep practicing to improve your skills!"}
    </p>
  </div>
  )
}

export default EndProgressBar
