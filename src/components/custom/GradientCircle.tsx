import React, { useMemo } from 'react';

interface GradientCircleProps {
  className: string;
  color: string;
  radius: number;
  blur: number;
}

export function GradientCircle({ className, color, radius, blur }: GradientCircleProps) {
  // Generate a stable ID based on the props
  const filterId = useMemo(() => {
    const hash = Math.abs(color.length * radius * blur).toString(16).slice(0, 2);
    return `filter0_f_2_${hash}`;
  }, [color, radius, blur]);

  return (
    <div className={className}>
      <div className="absolute inset-[-98.401%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
          <g filter={`url(#${filterId})`} opacity="0.6">
            <circle cx={radius} cy={radius} fill={color} r={radius - blur} />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height={radius * 2}
              width={radius * 2}
              x="0"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_2_91" stdDeviation={blur} />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
