import { useEffect, useRef, useState } from 'react'

// Two sets of prints pacing the corridors. Positions are sampled from a real
// SVG path so the steps actually follow the bend instead of faking it.
const ROUTES = [
  { d: 'M90,690 C280,660 300,430 520,408 S840,470 930,300 990,150 1140,128', name: 'Peter Pettigrew', delay: 0 },
  { d: 'M1150,560 C980,600 840,560 700,660 S420,740 180,700', name: 'Remus J. Lupin', delay: 2.6 },
]

function Route({ d, name, delay }) {
  const pathRef = useRef(null)
  const [marks, setMarks] = useState([])

  useEffect(() => {
    const path = pathRef.current
    if (!path || !path.getTotalLength) return
    const total = path.getTotalLength()
    const count = 28
    const next = []
    for (let i = 0; i < count; i++) {
      const at = (total * i) / count
      const a = path.getPointAtLength(at)
      const b = path.getPointAtLength(Math.min(total, at + 2))
      const angle = Math.atan2(b.y - a.y, b.x - a.x)
      const side = i % 2 ? 1 : -1
      next.push({
        i,
        x: a.x + Math.cos(angle + Math.PI / 2) * 7 * side,
        y: a.y + Math.sin(angle + Math.PI / 2) * 7 * side,
        rot: (angle * 180) / Math.PI,
      })
    }
    setMarks(next)
  }, [d])

  const head = marks.length ? marks[Math.floor(marks.length * 0.55)] : null

  return (
    <g>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {marks.map((m) => (
        <g
          key={m.i}
          className="fp"
          style={{ animationDelay: `${delay + m.i * 0.19}s` }}
          transform={`translate(${m.x} ${m.y}) rotate(${m.rot})`}
        >
          <ellipse rx="4.6" ry="3.1" />
          <circle cx="4.2" cy="-1.7" r="1.25" />
          <circle cx="4.9" cy="0.7" r="1.1" />
        </g>
      ))}
      {head && (
        <text className="walker-name" x={head.x + 12} y={head.y - 10}>
          {name}
        </text>
      )}
    </g>
  )
}

export default function Footprints() {
  return (
    <svg className="footprints" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {ROUTES.map((r) => (
        <Route key={r.name} {...r} />
      ))}
    </svg>
  )
}
