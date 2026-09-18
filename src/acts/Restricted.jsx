import { useEffect, useRef, useState } from 'react'
import LedgerCover from '../components/LedgerCover.jsx'
import LedgerSecret from '../components/LedgerSecret.jsx'
import SummonMark from '../components/SummonMark.jsx'
import { useWandLens } from '../useWandLens.js'
import { onFrame, pointer, wand } from '../magic.js'

const ACT_ONE_SPELLS = ['lumos', 'nox', 'alohomora']

export default function Restricted({ onTake }) {
  const coverRef = useRef(null)
  const memoryRef = useRef(null)
  const foundRef = useRef(false)
  const [found, setFound] = useState(false)
  const [hint, setHint] = useState('Move your wand across the page. The catalogue is lying to you.')
  const [typed, setTyped] = useState('')

  useWandLens(coverRef, memoryRef, { enabled: true })

  useEffect(() => {
    wand.live = true
    wand.base = 150
    return onFrame(() => {
      if (foundRef.current) return
      const tx = window.innerWidth * 0.2
      const ty = window.innerHeight * 0.72
      if (Math.hypot(pointer.x - tx, pointer.y - ty) < 130 && wand.lens > 40) {
        foundRef.current = true
        setFound(true)
        setHint('Shelf nine, F. It is warm, and it is not supposed to be.')
      }
    })
  }, [])

  useEffect(() => {
    let buffer = ''
    const onKey = (e) => {
      if (!/^[a-zA-Z]$/.test(e.key)) return
      buffer = (buffer + e.key.toLowerCase()).slice(-12)
      const cast = ACT_ONE_SPELLS.find((s) => buffer.endsWith(s))
      if (!cast) { setTyped(buffer.slice(-11)); return }
      buffer = ''
      setTyped('')
      if (cast === 'lumos') { wand.base = 330; setHint('Lumos. The light holds until you say nox.') }
      if (cast === 'nox') { wand.base = 150; setHint('Nox. Back to a wand tip and a bad idea.') }
      if (cast === 'alohomora') { wand.burstUntil = performance.now() + 2400; setHint('Alohomora. The whole page unlocks, briefly.') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="act act-restricted wand-zone">
      <LedgerSecret>
        <SummonMark found={found} />
      </LedgerSecret>
      <LedgerCover ref={coverRef} />
      <div className="layer memory" ref={memoryRef}>
        <LedgerSecret memory>
          <SummonMark found={found} />
        </LedgerSecret>
      </div>

      <div className="console">
        <p className="hint">
          {hint} <b>Spells:</b> lumos, nox, alohomora.
        </p>
        <div className="console-right">
          <div className="spell-buffer">{typed.toUpperCase().split('').join(' ')}</div>
          {found && (
            <button className="take" onClick={onTake}>Take it down from the shelf</button>
          )}
        </div>
      </div>
    </div>
  )
}
