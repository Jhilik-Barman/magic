import MapBackdrop from './MapBackdrop.jsx'
import Footprints from './Footprints.jsx'

// What the ledger actually says. Rendered twice: once as the true layer under
// the cover, once faintly as the "already searched" memory layer.
const SECRET_ENTRIES = [
  {
    shelf: 'III · A',
    title: 'The tale the third brother never finished telling',
    note: 'Margin, in a hand that is not the scribe\u2019s: he greeted Death as an old friend, and Death was not offended.',
  },
  {
    shelf: 'VII · C',
    title: 'The sink on the second floor that is not a sink',
    note: 'It hisses a little after midnight. Whatever you do, do not answer it in its own language.',
  },
  {
    shelf: 'II · B',
    title: 'Wormtail is here. Twelve paces behind you, and closing.',
    note: 'The map has no opinion about this. The map has never had an opinion about anything.',
  },
  {
    shelf: 'IX · F',
    title: 'Alohomora will not open the door you are thinking of',
    note: 'Some doors only open for the person who has finally stopped knocking on them.',
  },
]

export default function LedgerSecret({ memory = false, children = null }) {
  return (
    <div className={`layer secret ${memory ? 'memory' : ''}`} aria-hidden={memory}>
      <div className="parchment-bg" />
      <MapBackdrop />
      <Footprints />
      {children}
      <div className="page">
        <p className="kicker">Moony, Wormtail, Padfoot and Prongs, purveyors of aids to magical mischief-makers</p>
        <h1>The Marauder&rsquo;s Ledger</h1>
        <p className="lede">I solemnly swear that I am up to no good.</p>
        <ol className="entries">
          {SECRET_ENTRIES.map((e) => (
            <li key={e.shelf}>
              <span className="shelf">{e.shelf}</span>
              <p className="title">{e.title}</p>
              <p className="note">{e.note}</p>
            </li>
          ))}
        </ol>
        <p className="page-foot">
          <span className="seal">&#1017;</span>
          Four boys wrote this map and none of them were sorry.
        </p>
      </div>
    </div>
  )
}
