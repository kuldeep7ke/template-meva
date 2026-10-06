import type { FC } from 'react';

interface AnimatedIconProps {
  type: 'rocket' | 'shield' | 'device' | 'star' | 'zap' | 'check' | 'lock';
  className?: string;
  size?: number;
}

/**
 * Custom continuous CSS keyframes for store icon animations.
 * Scoped with a custom `mx-` prefix to avoid collisions.
 */
const ANIM_STYLES = `
@keyframes mx-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(-3deg); }
}
@keyframes mx-ping-slow {
  0% { transform: scale(1); opacity: 0.8; }
  75%, 100% { transform: scale(2.4); opacity: 0; }
}
@keyframes mx-shield-breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.07); opacity: 0.85; }
}
@keyframes mx-draw-check {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
@keyframes mx-screen-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
@keyframes mx-twinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(0.82) rotate(12deg); opacity: 0.65; }
}
@keyframes mx-bolt-flash {
  0%, 100% { opacity: 1; }
  45% { opacity: 1; }
  50% { opacity: 0.35; }
  55% { opacity: 1; }
}
@keyframes mx-lock-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}
.mx-anim-float { animation: mx-float 2.8s ease-in-out infinite; }
.mx-anim-ping { animation: mx-ping-slow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
.mx-anim-shield { animation: mx-shield-breathe 3s ease-in-out infinite; }
.mx-anim-check { stroke-dasharray: 24; animation: mx-draw-check 1.6s ease-out infinite alternate; }
.mx-anim-screen { animation: mx-screen-glow 2.4s ease-in-out infinite; }
.mx-anim-twinkle { animation: mx-twinkle 2.6s ease-in-out infinite; }
.mx-anim-bolt { animation: mx-bolt-flash 2.2s ease-in-out infinite; }
.mx-anim-lock { animation: mx-lock-bob 2.4s ease-in-out infinite; }
`;

let stylesInjected = false;

function useAnimStyles() {
  if (typeof document !== 'undefined' && !stylesInjected) {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-tme-anim', 'true');
    styleEl.textContent = ANIM_STYLES;
    document.head.appendChild(styleEl);
    stylesInjected = true;
  }
}

export const AnimatedIcon: FC<AnimatedIconProps> = ({ type, className = '', size = 28 }) => {
  useAnimStyles();

  switch (type) {
    case 'rocket':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mx-anim-float">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-amber-400 mx-anim-ping pointer-events-none" />
        </div>
      );

    case 'shield':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 mx-anim-shield">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" className="mx-anim-check" />
          </svg>
        </div>
      );

    case 'device':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
            <rect width="20" height="14" x="2" y="3" rx="2" className="mx-anim-screen" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
        </div>
      );

    case 'star':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="none" className="text-amber-400 drop-shadow-sm mx-anim-twinkle">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      );

    case 'zap':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="none" className="text-amber-500 mx-anim-bolt">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      );

    case 'lock':
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
            <g className="mx-anim-lock">
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </g>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          </svg>
        </div>
      );

    case 'check':
    default:
      return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
            <polyline points="20 6 9 17 4 12" className="mx-anim-check" />
          </svg>
        </div>
      );
  }
};
