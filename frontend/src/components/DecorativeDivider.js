import React from 'react';

export const DecorativeDivider = ({ symbol = '✦', className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-8 sm:my-12 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-deep-blue/30 to-transparent max-w-xs"></div>
      <span className="px-4 text-deep-blue/50 text-2xl">{symbol}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-deep-blue/30 to-transparent max-w-xs"></div>
    </div>
  );
};

export const ArtDecoCorner = ({ position = 'top-left', className = '' }) => {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180'
  };

  return (
    <div className={`absolute ${positions[position]} w-12 h-12 pointer-events-none ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M0 0 L16 0 L0 16 Z" 
          fill="#1D2847" 
          opacity="0.15"
        />
        <line x1="0" y1="16" x2="16" y2="0" stroke="#1D2847" strokeWidth="0.5" opacity="0.3" />
        <circle cx="8" cy="8" r="1.5" fill="#1D2847" opacity="0.4" />
      </svg>
    </div>
  );
};
