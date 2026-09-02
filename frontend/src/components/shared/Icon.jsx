/**
 * Monoline SVG icon set for Covenant.
 * All icons are stroke-only, no fills, no color. 
 * Pass `color`, `size`, and `strokeWidth` as props.
 */

const ICONS = {
  // Buyer Agent / Robot / AI
  bot: (
    <g>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" />
      <circle cx="8.5" cy="13.5" r="1.5" />
      <circle cx="15.5" cy="13.5" r="1.5" />
      <path d="M9 17h6" />
      <path d="M3 12H1M23 12h-2" />
    </g>
  ),

  // Policy Engine / Scales / Balance
  scale: (
    <g>
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M3 7l5 5-5 5" strokeLinejoin="round" />
      <path d="M21 7l-5 5 5 5" strokeLinejoin="round" />
      <path d="M3 7h6M15 7h6" />
    </g>
  ),

  // Payment / Card
  card: (
    <g>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4M14 15h4" />
    </g>
  ),

  // Brain / AI Think
  brain: (
    <g>
      <path d="M12 5a7 7 0 0 0-7 7c0 2.21 1.01 4.18 2.6 5.5H12v-2h-1.5C9.12 14.5 8 12.86 8 11a4 4 0 0 1 4-4" />
      <path d="M12 5a7 7 0 0 1 7 7c0 2.21-1.01 4.18-2.6 5.5H12v-2h1.5c1.38-.5 2.5-2.14 2.5-3.5" />
      <path d="M12 5v2M12 19v-2" />
      <path d="M8 9.5a2.5 2.5 0 0 0 0 5" />
      <path d="M16 9.5a2.5 2.5 0 0 1 0 5" />
    </g>
  ),

  // Document / Mandate
  document: (
    <g>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </g>
  ),

  // Trending up / Chart / Revenue
  trending: (
    <g>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </g>
  ),

  // Shield / Security
  shield: (
    <g>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </g>
  ),

  // Lock / Mandate signed
  lock: (
    <g>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </g>
  ),

  // Zap / Attack / Lightning
  zap: (
    <g>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </g>
  ),

  // Warning / Alert triangle
  warn: (
    <g>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </g>
  ),

  // Check / Verified
  check: (
    <g>
      <polyline points="20 6 9 17 4 12" />
    </g>
  ),

  // X / Close / Blocked
  x: (
    <g>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </g>
  ),

  // Layers / Stack
  layers: (
    <g>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </g>
  ),

  // Cpu / Engine
  cpu: (
    <g>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </g>
  ),

  // Eye / Audit / View
  eye: (
    <g>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),

  // Terminal / Code / Isolation
  terminal: (
    <g>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </g>
  ),

  // Coin / Money / Revenue
  coin: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a3 3 0 1 0 0 5M12 7v2M12 15v2" />
    </g>
  ),

  // Arrow right
  arrowRight: (
    <g>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </g>
  ),

  // Refresh / Recover
  refresh: (
    <g>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </g>
  ),

  // Package / Product / Catalog
  package: (
    <g>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </g>
  ),
};

export default function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.5, style }) {
  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
