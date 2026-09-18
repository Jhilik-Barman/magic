import { useEffect, useRef, useState } from 'react'
import { lore, wand } from '../magic.js'

const FALLBACK = 'You never wrote anything. The book has kept the silence instead.'

// The candles come up out of the dark and hold whatever the reader left behind.
export default function Finale({ onAgain }) {
  const canvasRef = useRef(null)
  const line = lore.first || FALLBACK
  const [shown, setShown] = useState('')
  const [tail, setTail] = useState(false)

  useEffect(() => { wand.live = false }, [])

  useEffect(() => {
    let i = 0
    let stop = false
    const type = () => {
      if (stop) return
      i += 1
      setShown(line.slice(0, i))
      if (i < line.length) setTimeout(type, 62)
      else setTimeout(() => !stop && setTail(true), 1400)
    }
    const kick = setTimeout(type, 2600)
    return () => { stop = true; clearTimeout(kick) }
  }, [line])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let dpr = 1
    const candles = []
    const stars = []

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const w = window.innerWidth
      const h = window.innerHeight
      candles.length = 0
      const count = w < 700 ? 42 : 96
      for (let i = 0; i < count; i++) {
        candles.push({
          x: Math.random() * w,
          y: h + 60 + Math.random() * 400,
          goal: h * (0.06 + Math.random() * 0.74),
          size: 0.6 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
          rise: 0.55 + Math.random() * 0.75,
        })
      }
      stars.length = 0
      for (let i = 0; i < 90; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h * 0.7, r: Math.random() * 1.1, p: Math.random() * 6 })
      }
    }
    build()
    window.addEventListener('resize', build)

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        const tw = 0.35 + 0.35 * Math.sin(now / 900 + s.p)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 232, 244, ${tw})`
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'lighter'
      for (const c of candles) {
        if (c.y > c.goal) c.y -= c.rise
        const bob = Math.sin(now / 1400 + c.phase) * 4
        const y = c.y + bob
        const flick = 0.82 + 0.18 * Math.sin(now / 130 + c.phase * 3)

        ctx.beginPath()
        ctx.ellipse(c.x, y + 14 * c.size, 1.6 * c.size, 12 * c.size, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(238, 226, 198, ${0.1 * flick})`
        ctx.fill()

        const g = ctx.createRadialGradient(c.x, y, 0, c.x, y, 26 * c.size)
        g.addColorStop(0, `rgba(255, 236, 178, ${0.95 * flick})`)
        g.addColorStop(0.18, `rgba(240, 190, 90, ${0.55 * flick})`)
        g.addColorStop(1, 'rgba(240, 190, 90, 0)')
        ctx.beginPath()
        ctx.arc(c.x, y, 26 * c.size, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
    raf = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', build) }
  }, [])

  return (
    <div className="act act-finale">
      <canvas className="ceiling" ref={canvasRef} aria-hidden="true" />
      <div className="finale-text">
        <p className="lead">The book shut itself, and the ceiling remembered one line of yours.</p>
        <blockquote className="kept">{shown}<span className="nib" /></blockquote>
        {tail && (
          <div className="tail">
            <p>That is the whole trick. It was never the book.</p>
            <button onClick={onAgain}>Mischief managed</button>
          </div>
        )}
      </div>
    </div>
  )
}
