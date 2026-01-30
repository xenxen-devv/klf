
import React from 'react';

interface TimerCircleProps {
  percent: number;
  timeLeft: number;
  isActive: boolean;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({ percent, isActive }) => {
  const radius = 160;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
        isActive ? 'bg-[#00D9A3]/10 opacity-100' : 'bg-transparent opacity-0'
      }`} />
      
      {/* Inner Circle Background */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm" />

      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 z-10"
      >
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00D9A3"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 1s linear',
            strokeLinecap: 'round'
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};
