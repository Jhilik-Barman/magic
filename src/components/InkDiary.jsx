import { useEffect, useRef, useState } from 'react'

import { lore } from '../magic.js'

// Whatever you write sinks into the page, and the page writes back in its own hand.

const DIARY_REPLIES = [
  {
    match: /\b(hi|hello|hey|namaste)\b/i,
    say: 'Hello. Nobody has written in me for fifty-one years.',
  },

  {
    match: /\b(who|what) (are|r) (you|u)\b/i,
    say: 'A book. Only a book. Remembering is the whole of the job.',
  },

  {
    match: /\b(my name is|i am|i'm|im)\b/i,
    say: 'A good name. I have put it somewhere you cannot reach.',
  },

  {
    match: /\b(help|save|stuck)\b/i,
    say: 'Help is what people write once they already know the answer.',
  },

  {
    match: /\b(love|loved|miss)\b/i,
    say: 'Write that name again, smaller, so the page can keep it.',
  },

  {
    match: /\b(die|death|dead|end)\b/i,
    say: 'I open at the close. Not one page sooner.',
  },

  {
    match: /\b(scared|afraid|fear)\b/i,
    say: 'Fear is only memory that has arrived a little early.',
  },

  {
    match: /\b(magic|spell|wand)\b/i,
    say: 'You are doing it now. It looks like typing, which is the trick.',
  },

  {
    match: /./,
    say: 'You have asked me something. I have written the answer on a page you have not turned yet.',
  },
]

const DIARY_FALLBACK = [
  'The ink has taken it. It will be here long after you are not.',
  'I have read it twice. Once for you, once for whoever comes next.',
  'Curious. Nobody has ever put it quite that way.',
  'Noted, in a hand that is not mine and not yours.',
  'The page is warmer where you wrote that.',
]

export default function InkDiary({ active }) {
  const [lines, setLines] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [sealed, setSealed] = useState(false)

  const seq = useRef(0)
  const timers = useRef([])

  const later = (fn, ms) => {
    const timer = setTimeout(fn, ms)
    timers.current.push(timer)
  }

  // Cleanup timers
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const answerFor = (text) => {
    const hit = DIARY_REPLIES.find((r) => r.match.test(text))

    if (hit) {
      return hit.say
    }

    return DIARY_FALLBACK[
      seq.current % DIARY_FALLBACK.length
    ]
  }

  const write = () => {
    const text = draft.trim()

    if (!text || busy || sealed) {
      return
    }

    setBusy(true)
    setDraft('')

    /*
      IMPORTANT:
      Save the FIRST thing the user writes.
      Finale.jsx will read lore.first later.
    */
    if (!lore.first) {
      lore.first = text
    }

    // Keep every line
    lore.lines.push(text)

    const id = ++seq.current

    // Show user's writing
    setLines((current) => [
      ...current,
      {
        id,
        who: 'you',
        text,
        sunk: false,
      },
    ].slice(-7))

    /*
      After a short delay the user's ink
      sinks into the page.
    */
    later(() => {
      setLines((current) =>
        current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                sunk: true,
              }
            : entry
        )
      )
    }, 750)

    /*
      Book responds after the user's writing
      disappears.
    */
    const reply = answerFor(text)

    later(() => {
      const replyId = ++seq.current

      setLines((current) => [
        ...current.filter(
          (entry) => entry.id !== id
        ),
        {
          id: replyId,
          who: 'book',
          text: '',
          full: reply,
          done: false,
        },
      ].slice(-7))

      let i = 0

      const type = () => {
        i += 1

        setLines((current) =>
          current.map((entry) =>
            entry.id === replyId
              ? {
                  ...entry,
                  text: reply.slice(0, i),
                  done: i >= reply.length,
                }
              : entry
          )
        )

        if (i < reply.length) {
          later(type, 26)
        } else {
          setBusy(false)
        }
      }

      later(type, 260)
    }, 1900)
  }

  /*
    This is the special final spell action.
    User can press the button after writing.
  */
  const sealSpell = () => {
    const text = draft.trim()

    if (!text || busy || sealed) {
      return
    }

    setBusy(true)
    setDraft('')

    /*
      This becomes the message shown in Finale.
    */
    lore.first = text

    /*
      Also save it in lore.lines.
    */
    lore.lines.push(text)

    const id = ++seq.current

    setLines((current) => [
      ...current,
      {
        id,
        who: 'you',
        text,
        sunk: false,
      },
    ].slice(-7))

    /*
      Make the writing disappear magically.
    */
    later(() => {
      setLines((current) =>
        current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                sunk: true,
              }
            : entry
        )
      )
    }, 900)

    /*
      Seal the spell.
    */
    later(() => {
      setSealed(true)
      setBusy(false)
    }, 1800)
  }

  return (
    <div
      className="diary"
      data-no-turn
    >
      <h2>The page that answers</h2>

      <div
        className="ledger"
        data-no-turn
      >
        {lines.length === 0 && (
          <p
            style={{
              opacity: 0.45,
              fontStyle: 'italic',
            }}
          >
            Write a line below. Watch where it goes.
          </p>
        )}

        {lines.map((l) => (
          <div
            key={l.id}
            className={`line ${l.who} ${
              l.sunk ? 'sunk' : ''
            } ${l.done ? 'done' : ''}`}
          >
            {l.text}
          </div>
        ))}

        {sealed && (
          <div className="spell-sealed">
            ✦ Your words have been sealed into the book ✦
          </div>
        )}
      </div>

      <div
        className="quill"
        data-no-turn
      >
        <input
          value={draft}
          disabled={!active || busy || sealed}
          onChange={(e) =>
            setDraft(e.target.value)
          }
          onKeyDown={(e) => {
            e.stopPropagation()

            if (e.key === 'Enter') {
              write()
            }
          }}
          placeholder={
            sealed
              ? 'Your spell has been sealed...'
              : 'Write your magic here...'
          }
          aria-label="Write to the book"
          maxLength={90}
        />

        {!sealed && (
          <button
            type="button"
            className="cast-spell"
            disabled={
              !active ||
              busy ||
              !draft.trim()
            }
            onClick={(e) => {
              e.stopPropagation()
              sealSpell()
            }}
          >
            ✦ CAST SPELL
          </button>
        )}
      </div>
    </div>
  )
}