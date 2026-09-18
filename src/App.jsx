import { useEffect, useRef, useState } from 'react'
import Restricted from './acts/Restricted.jsx'
import BookAct from './acts/BookAct.jsx'
import Finale from './acts/Finale.jsx'
import WandTrail from './components/WandTrail.jsx'
import { startEngine, onFrame, pointer, wand, lore } from './magic.js'

export default function App() {
  const [act, setAct] = useState('ledger')
  const [fading, setFading] = useState(false)
  const ringRef = useRef(null)

  useEffect(() => { startEngine() }, [])

  // The wand ring is the cursor, so it lives above every act.
  useEffect(() => onFrame(() => {
    const ring = ringRef.current
    if (!ring) return
    const r = Math.max(0, wand.lens)
    ring.style.width = `${r * 2}px`
    ring.style.height = `${r * 2}px`
    ring.style.transform = `translate(${Math.round(pointer.x - r)}px, ${Math.round(pointer.y - r)}px)`
    ring.style.opacity = r > 6 ? '1' : '0'
  }), [])

  const move = (next) => {
    setFading(true)
    setTimeout(() => { setAct(next); setFading(false) }, 720)
  }

  const restart = () => {
    lore.lines = []
    lore.first = null
    move('ledger')
  }

  return (
    <div className={`world ${fading ? 'dimmed' : ''}`}>
      {act === 'ledger' && <Restricted onTake={() => move('book')} />}
      {act === 'book' && <BookAct onFinish={() => move('finale')} />}
      {act === 'finale' && <Finale onAgain={restart} />}
      <div className="lens-ring" ref={ringRef} />
      <WandTrail />
    </div>
  )
}
