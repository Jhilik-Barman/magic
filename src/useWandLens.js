import { useEffect, useRef } from 'react'
import { onFrame, pointer, wand } from './magic.js'

const CLEAR = 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))'

function setMask(el, value) {
  if (!el) return
  el.style.maskImage = value
  el.style.webkitMaskImage = value
}

/**
 * Punches a moving hole in `coverRef` so whatever sits under it shows through,
 * and paints a fading record of everywhere the light has already been into
 * `memoryRef`. Set `local` when the cover is a page inside the book rather than
 * the whole window.
 */
export function useWandLens(coverRef, memoryRef, opts = {}) {
  const { enabled = true, local = false, radius = null, spacing = 74, life = 24000, limit = 64 } = opts
  const memory = useRef([])
  const lastDot = useRef({ x: -9999, y: -9999 })
  const lastBuild = useRef(0)
  const box = useRef({ left: 0, top: 0, at: 0 })

  useEffect(() => {
    if (!enabled) {
      setMask(coverRef.current, 'none')
      setMask(memoryRef && memoryRef.current, CLEAR)
      memory.current = []
      lastDot.current = { x: -9999, y: -9999 }
      return undefined
    }

    return onFrame((now) => {
      const cover = coverRef.current
      if (!cover) return

      if (local && now - box.current.at > 200) {
        const r = cover.getBoundingClientRect()
        box.current = { left: r.left, top: r.top, at: now }
      }
      const ox = local ? box.current.left : 0
      const oy = local ? box.current.top : 0

      const breathe = Math.sin(now / 620) * 4 + Math.sin(now / 231) * 2
      const r = Math.max(0, (radius != null ? radius : wand.lens) + (wand.lens > 4 ? breathe : 0))
      const x = Math.round(pointer.x - ox)
      const y = Math.round(pointer.y - oy)

      setMask(cover, `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 54%, rgba(0,0,0,0.5) 76%, rgb(0,0,0) 100%)`)

      if (!memoryRef) return
      const dx = x - lastDot.current.x
      const dy = y - lastDot.current.y
      let dirty = false
      if (r > 8 && dx * dx + dy * dy > spacing * spacing) {
        memory.current.push({ x, y, born: now })
        if (memory.current.length > limit) memory.current.shift()
        lastDot.current = { x, y }
        dirty = true
      }
      if (now - lastBuild.current > 650) dirty = true
      if (!dirty) return

      lastBuild.current = now
      memory.current = memory.current.filter((d) => now - d.born < life)
      const layers = [CLEAR]
      for (const d of memory.current) {
        const a = (1 - (now - d.born) / life) * 0.6
        layers.push(`radial-gradient(circle 100px at ${d.x}px ${d.y}px, rgba(0,0,0,${a.toFixed(3)}) 0%, rgba(0,0,0,${(a * 0.4).toFixed(3)}) 52%, rgba(0,0,0,0) 78%)`)
      }
      setMask(memoryRef.current, layers.join(', '))
    })
  }, [enabled, local, radius, coverRef, memoryRef, spacing, life, limit])

  return memory
}
