import { useEffect, useRef, useState } from 'react'

// It gets quicker each time you miss. Catch it and the page gives up its secret.
export default function SnitchHunt({ active, onCaught }) {
  const fieldRef = useRef(null)
  const snitchRef = useRef(null)
  const pos = useRef({ x: 60, y: 60, tx: 60, ty: 60 })
  const speed = useRef(0.022)
  const [caught, setCaught] = useState(false)
  const [misses, setMisses] = useState(0)

  useEffect(() => {
    if (caught) return
    let raf = 0
    let nextJump = 0

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const field = fieldRef.current
      const el = snitchRef.current
      if (!field || !el) return
      const w = field.clientWidth
      const h = field.clientHeight
      if (w < 10) return

      if (now > nextJump) {
        pos.current.tx = 30 + Math.random() * Math.max(10, w - 60)
        pos.current.ty = 30 + Math.random() * Math.max(10, h - 60)
        nextJump = now + 520 + Math.random() * 900
      }
      pos.current.x += (pos.current.tx - pos.current.x) * speed.current
      pos.current.y += (pos.current.ty - pos.current.y) * speed.current
      const wobble = Math.sin(now / 180) * 5
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y + wobble}px)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [caught])

  const grab = () => {
    if (misses < 2) {
      setMisses((m) => m + 1)
      speed.current += 0.02
      pos.current.tx = Math.random() * 240
      pos.current.ty = Math.random() * 200
      return
    }
    setCaught(true)
    if (onCaught) setTimeout(onCaught, 3200)
  }

  return (
    <div className="diary">
      <h2>The last page but one</h2>
      <p style={{ opacity: caught ? 0 : 0.7, transition: 'opacity 600ms' }}>
        {misses === 0 && 'Something gold is loose in the margin. Close your hand on it.'}
        {misses === 1 && 'It slipped. Snitches have flesh memories; be quicker.'}
        {misses === 2 && 'Once more. It is tired now.'}
      </p>
      <div className="snitch-field" ref={fieldRef}>
        {!caught && (
          <button className="snitch" ref={snitchRef} onClick={grab} aria-label="Catch the snitch" disabled={!active}>
            <svg viewBox="0 0 46 46">
              <g className="wing l" fill="#E8E2D2" stroke="#9A8C6A" strokeWidth="0.8" opacity="0.92">
                <path d="M21 23 C9 8, -4 12, 2 20 C-3 24, 8 31, 21 24 Z" />
              </g>
              <g className="wing r" fill="#E8E2D2" stroke="#9A8C6A" strokeWidth="0.8" opacity="0.92">
                <path d="M25 23 C37 8, 50 12, 44 20 C49 24, 38 31, 25 24 Z" />
              </g>
              <circle cx="23" cy="23" r="8.5" fill="#C8A33C" stroke="#8A6B1C" strokeWidth="1.2" />
              <circle cx="20.4" cy="20.4" r="2.4" fill="#F0DC9C" opacity="0.85" />
            </svg>
          </button>
        )}
        {caught && (
          <div className="caught">
            <p className="inscription">I open at the close.</p>
          </div>
        )}
      </div>
    </div>
  )
}
