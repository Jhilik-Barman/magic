// Only exists on the true layer, so the reader has to find it with the light.
export default function SummonMark({ found }) {
  return (
    <div className={`summon ${found ? 'found' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 120 140" width="110" height="128">
        <path d="M18 24 L60 14 L102 24 L102 118 L60 108 L18 118 Z" fill="none" stroke="#4A3417" strokeWidth="2.4" />
        <path d="M60 14 V108" stroke="#4A3417" strokeWidth="2.4" />
        <path d="M28 40 H52 M28 56 H50 M28 72 H53 M70 40 H94 M70 56 H92 M70 72 H93"
              stroke="#6B4E22" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <circle cx="60" cy="86" r="9" fill="none" stroke="#8C2F2F" strokeWidth="2" />
      </svg>
      <p>Shelf IX &middot; F</p>
    </div>
  )
}
