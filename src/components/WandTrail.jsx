import { useEffect, useRef } from 'react'
import { pointer, wand, sparks } from '../magic.js'

// Gold embers shed by the wand tip, only while the wand is lit.
export default function WandTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const now = performance.now()
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const emit = pointer.engaged && wand.live ? 1 : 0
      for (let i = 0; i < emit; i++) {
        sparks.push({
          x: pointer.x + (Math.random() - 0.5) * 14,
          y: pointer.y + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9 - 0.25,
          life: 1,
          decay: 0.012 + Math.random() * 0.018,
          size: 1 + Math.random() * 2.2,
        })
      }
      if (sparks.length > 420) sparks.splice(0, sparks.length - 420)

      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.008
        s.life -= s.decay
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const tint = '214,172,62'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${tint},${s.life * 0.75})`
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas className="trail-canvas" ref={canvasRef} aria-hidden="true" />
}
