import { useRef } from 'react'
import { useWandLens } from '../useWandLens.js'

// The two ideas folded together: the cloak trick, but happening inside one leaf
// of the book instead of across the whole window.
export default function InvisiblePage({ active }) {
  const coverRef = useRef(null)
  const memoryRef = useRef(null)
  useWandLens(coverRef, memoryRef, { enabled: active, local: true, radius: 96 })

  const truth = (
    <>
      <h2>What the binder left out</h2>
      <p>
        There is a way out of the castle that appears on no plan, and a boy who used it
        every Thursday for four years without once being asked where he had been.
      </p>
      <p>
        He is the reason this book learned to answer. He asked it something on a
        Thursday and it has been trying to get the wording right ever since.
      </p>
      <p style={{ fontStyle: 'italic', color: 'var(--rust)' }}>
        Keep the light moving. The page only holds so much at once.
      </p>
    </>
  )

  return (
    <div className="face">
      <div className="paper truth">{truth}<div className="folio">Page ii, verso</div></div>
      <div className="paper blank" ref={coverRef}>
        <h2>&nbsp;</h2>
        <p className="blank-note">This leaf was left blank by the binder.</p>
        <div className="ruled" />
        <div className="folio">Page ii, verso</div>
      </div>
      <div className="paper truth ghost" ref={memoryRef}>{truth}<div className="folio">Page ii, verso</div></div>
    </div>
  )
}
