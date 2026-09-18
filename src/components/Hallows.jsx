// The frontispiece draws itself the first time the spread is opened.
export default function Hallows({ drawing }) {
  return (
    <div className={drawing ? 'drawing' : ''} style={{ display: 'contents' }}>
      <svg className="hallows" viewBox="0 0 240 220" aria-label="An old ink diagram">
        <path d="M120 22 L226 200 L14 200 Z" style={{ '--len': 620 }} />
        <circle cx="120" cy="138" r="58" style={{ '--len': 380 }} />
        <line x1="120" y1="22" x2="120" y2="200" style={{ '--len': 190 }} />
      </svg>
      <div className="blot" />
    </div>
  )
}
