// The castle plan that sits under the parchment. Drawn once, never re-rendered.
export default function MapBackdrop() {
  return (
    <svg className="map-backdrop" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="#6B4E22" fill="none" strokeWidth="1.6" opacity="0.85">
        <rect x="52" y="86" width="286" height="176" />
        <rect x="70" y="104" width="250" height="140" strokeDasharray="6 5" strokeWidth="1" />
        <rect x="392" y="56" width="150" height="120" />
        <rect x="860" y="120" width="264" height="210" />
        <rect x="882" y="142" width="220" height="166" strokeDasharray="6 5" strokeWidth="1" />
        <rect x="120" y="536" width="230" height="200" />
        <rect x="700" y="520" width="330" height="214" />
        <rect x="726" y="546" width="278" height="162" strokeDasharray="5 6" strokeWidth="1" />
        <path d="M338 174 H392 M542 116 H620 M620 116 V300 M620 300 H860" />
        <path d="M235 262 V536 M350 636 H700 M1030 627 H1140" />
        <path d="M992 330 V520" />
      </g>

      {/* moving staircase */}
      <g stroke="#6B4E22" strokeWidth="1.3" opacity="0.8">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={432 + i * 13} y1={214 + i * 12} x2={470 + i * 13} y2={198 + i * 12} />
        ))}
        <line x1="432" y1="214" x2="536" y2="310" strokeDasharray="4 4" />
        <line x1="470" y1="198" x2="574" y2="294" strokeDasharray="4 4" />
      </g>

      {/* compass rose */}
      <g transform="translate(1060 690)" opacity="0.8">
        <circle r="44" fill="none" stroke="#6B4E22" strokeWidth="1.3" />
        <circle r="30" fill="none" stroke="#6B4E22" strokeWidth="0.8" strokeDasharray="3 4" />
        <path d="M0,-42 L9,0 L0,42 L-9,0 Z" fill="#8C2F2F" opacity="0.75" />
        <path d="M-42,0 L0,-8 L42,0 L0,8 Z" fill="#6B4E22" opacity="0.5" />
        <text x="0" y="-52" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="15" fill="#6B4E22">N</text>
      </g>

      {/* room labels */}
      <g fontFamily="Cinzel, serif" fontSize="14" fill="#6B4E22" opacity="0.9">
        <text x="72" y="118">Restricted Section</text>
        <text x="880" y="160">Room of Requirement</text>
        <text x="140" y="566">Second-floor lavatory</text>
        <text x="722" y="552">Great Hall</text>
      </g>
    </svg>
  )
}
