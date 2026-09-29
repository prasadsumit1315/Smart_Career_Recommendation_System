import React, { useEffect, useState } from 'react';

export default function CircularProgress({
  percent = 0,
  size = 80,
  strokeWidth = 6,
  color = null,
}) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Number((eased * percent).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percent]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  // Determine dynamic neon color if not specified
  const ringColor =
    color ||
    (percent >= 80 ? '#00f5a0' : percent >= 65 ? '#00f2fe' : percent >= 50 ? '#f6d365' : '#ff416c');

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 6px ${ringColor}88)`,
            transition: 'stroke-dashoffset 0.1s linear',
          }}
        />
      </svg>
      {/* Count-up Center Text */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: `${size * 0.22}px`, fontWeight: 700, color: '#fff' }}>
          {animatedPercent}%
        </span>
        <span style={{ fontSize: `${size * 0.1}px`, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Match
        </span>
      </div>
    </div>
  );
}
