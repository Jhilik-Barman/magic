import { forwardRef } from 'react'

// The lie. Same grid, same baselines, same shelf marks as the secret layer —
// only the words are dull, so the reveal reads as x-ray rather than swap.
const COVER_ENTRIES = [
  { shelf: 'III \u00B7 A', title: 'The Standard Book of Spells, Grade One', note: 'Available. Forty-one copies. No annotations of any kind.' },
  { shelf: 'VII \u00B7 C', title: 'A History of Hogwarts Plumbing, vol. II', note: 'Available. Water damage to pages 60\u201374. Otherwise unremarkable.' },
  { shelf: 'II \u00B7 B', title: 'Quidditch Through the Ages', note: 'On loan. Due back Tuesday. Borrower has not been seen since Monday.' },
  { shelf: 'IX \u00B7 F', title: 'Gardening with Mandrakes', note: 'Available. Earmuffs are kept in the drawer beneath the catalogue.' },
]

const LedgerCover = forwardRef(function LedgerCover(props, ref) {
  return (
    <div className="layer cover" ref={ref}>
      <div className="page">
        <span className="stamp">Nothing of interest</span>
        <p className="kicker">Hogwarts Library, catalogue of permitted volumes, revised Michaelmas term</p>
        <h1>The Restricted Section</h1>
        <p className="lede">
          Every volume below has been checked, stamped and found entirely harmless. There is no
          reason to look any closer at this page.
        </p>
        <ol className="entries">
          {COVER_ENTRIES.map((e) => (
            <li key={e.shelf}>
              <span className="shelf">{e.shelf}</span>
              <p className="title">{e.title}</p>
              <p className="note">{e.note}</p>
            </li>
          ))}
        </ol>
        <p className="page-foot">Catalogue maintained by the librarian. Do not bring food. Do not bring wands.</p>
      </div>
    </div>
  )
})

export default LedgerCover
