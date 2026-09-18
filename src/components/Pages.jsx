import Hallows from './Hallows.jsx'

export function Cover({ onOpen }) {
  return (
    <div className="face book-cover" onClick={onOpen} role="button" tabIndex={0}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}>
      <div className="cover-plate">
        <svg className="sigil" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 10 L92 84 L8 84 Z" fill="none" stroke="#C8A33C" strokeWidth="2.4" />
          <circle cx="50" cy="58" r="24" fill="none" stroke="#C8A33C" strokeWidth="2.4" />
          <line x1="50" y1="10" x2="50" y2="84" stroke="#C8A33C" strokeWidth="2.4" />
        </svg>
        <h1>The Answering Book</h1>
        <p className="byline">Shelf IX &middot; F. Owner unrecorded. Do not read aloud.</p>
      </div>
      <div className="open-cue">Open it</div>
    </div>
  )
}

export function Frontispiece({ drawing }) {
  return (
    <div className="face back">
      <div className="paper">
        <Hallows drawing={drawing} />
        <div className="folio">Frontispiece</div>
      </div>
    </div>
  )
}

export function TitlePage() {
  return (
    <div className="face">
      <div className="paper">
        <h2>Of things that answer back</h2>
        <p className="drop">
          Most books are patient. They hold their one arrangement of words and wait to be
          agreed with. This one does not. It was bound the year the castle stopped keeping
          records, and it has been listening ever since.
        </p>
        <p>Three things live in these pages. The book notices when you hurry.</p>
        <div className="folio">Page i</div>
      </div>
    </div>
  )
}

export function InvisibleIntro() {
  return (
    <div className="face back">
      <div className="paper">
        <h2>First: the leaf that looks empty</h2>
        <p>
          The binder swore the facing page was blank and was paid for saying so. Hold your
          light against it and move slowly; the words are there, they are simply shy of
          daylight.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--rust)' }}>
          Wherever the light has already been, a little ink stays behind.
        </p>
        <div className="folio">Page ii</div>
      </div>
    </div>
  )
}

export function DiaryIntro() {
  return (
    <div className="face back">
      <div className="paper">
        <h2>Second: the ink that will not stay</h2>
        <p>
          Write anything on the facing page. Your words sink through the paper the way rain
          sinks through a roof that has given up, and something underneath answers in a hand
          nobody has been able to match.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--rust)' }}>
          Do not write anything you would mind being kept.
        </p>
        <div className="folio">Page iii</div>
      </div>
    </div>
  )
}

export function SnitchIntro() {
  return (
    <div className="face back">
      <div className="paper">
        <h2>Third: the thing in the margin</h2>
        <p>
          A snitch was pressed into this book like a flower and never quite stopped moving.
          It is faster on the second pass and faster still on the third, because it learns
          the shape of your hand.
        </p>
        <p>Catch it and the book decides it has heard enough.</p>
        <div className="folio">Page iv</div>
      </div>
    </div>
  )
}

export function Closing() {
  return (
    <div className="face back">
      <div className="paper">
        <h2>The reader</h2>
        <p>You came to the end, which most people do not. The book has written that down.</p>
        <p style={{ fontStyle: 'italic' }}>It writes everything down.</p>
        <div className="folio">Page v</div>
      </div>
    </div>
  )
}

export function BackBoard() {
  return (
    <div className="face">
      <div className="paper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--display)', letterSpacing: '0.2em', fontSize: '0.78rem', opacity: 0.45 }}>
          END OF THE VOLUME
        </p>
      </div>
    </div>
  )
}
