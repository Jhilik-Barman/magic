import { useEffect, useRef, useState } from 'react'

import {
  Cover,
  Frontispiece,
  TitlePage,
  InvisibleIntro,
  DiaryIntro,
  SnitchIntro,
  Closing,
  BackBoard,
} from '../components/Pages.jsx'

import InvisiblePage from '../components/InvisiblePage.jsx'
import InkDiary from '../components/InkDiary.jsx'
import SnitchHunt from '../components/SnitchHunt.jsx'

import { wand } from '../magic.js'

const LEAVES = 5
const INVISIBLE_SPREAD = 2

export default function BookAct({ onFinish }) {
  const [turned, setTurned] = useState(0)

  const busy = useRef(false)
  const bookRef = useRef(null)
  const finishTimer = useRef(null)
  const finished = useRef(false)

  // --------------------------------------------------
  // Wand
  // --------------------------------------------------

  useEffect(() => {
    wand.live = turned === INVISIBLE_SPREAD
    wand.base = 150
  }, [turned])

  useEffect(() => {
    return () => {
      wand.live = false

      if (finishTimer.current) {
        clearTimeout(finishTimer.current)
      }
    }
  }, [])

  // --------------------------------------------------
  // Page navigation
  // --------------------------------------------------

  const go = (next) => {
    if (busy.current) return

    const clamped = Math.max(
      0,
      Math.min(LEAVES, next)
    )

    if (clamped === turned) return

    busy.current = true

    setTurned(clamped)

    setTimeout(() => {
      busy.current = false
    }, 700)
  }

  // --------------------------------------------------
  // After the LAST PAGE becomes visible
  // wait a little and then go to Finale
  // --------------------------------------------------

  useEffect(() => {
    if (turned !== LEAVES) return
    if (finished.current) return

    finishTimer.current = setTimeout(() => {
      if (finished.current) return

      finished.current = true
      onFinish()
    }, 2300)

    return () => {
      if (finishTimer.current) {
        clearTimeout(finishTimer.current)
      }
    }
  }, [turned, onFinish])

  // --------------------------------------------------
  // Snitch caught
  //
  // IMPORTANT:
  // Don't go directly to Finale.
  // First open the final page.
  // --------------------------------------------------

  const handleSnitchCaught = () => {
    if (turned !== 4) return

    go(LEAVES)
  }

  // --------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------

  useEffect(() => {
    const onKey = (e) => {
      // Don't turn page while typing
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === 'ArrowRight') {
        go(turned + 1)
      }

      if (e.key === 'ArrowLeft') {
        go(turned - 1)
      }
    }

    window.addEventListener(
      'keydown',
      onKey
    )

    return () => {
      window.removeEventListener(
        'keydown',
        onKey
      )
    }
  }, [turned])

  // --------------------------------------------------
  // Click left/right side of book
  // --------------------------------------------------

  const handleBookClick = (e) => {
    /*
      Don't turn page when interacting with:
      - input
      - textarea
      - select
      - button
      - link
      - book cover
      - data-no-turn elements
    */

    if (
      e.target.closest(
        'input, textarea, select, button, a, .book-cover, [data-no-turn]'
      )
    ) {
      return
    }

    if (!bookRef.current) return

    const rect =
      bookRef.current.getBoundingClientRect()

    const clickX =
      e.clientX - rect.left

    const bookWidth = rect.width

    // LEFT → Previous page
    if (clickX < bookWidth / 2) {
      go(turned - 1)
      return
    }

    // RIGHT → Next page
    go(turned + 1)
  }

  // --------------------------------------------------
  // Book leaves
  // --------------------------------------------------

  const leaves = [
    {
      front: (
        <Cover
          onOpen={() => go(1)}
        />
      ),

      back: (
        <Frontispiece
          drawing={turned >= 1}
        />
      ),
    },

    {
      front: <TitlePage />,
      back: <InvisibleIntro />,
    },

    {
      front: (
        <InvisiblePage
          active={
            turned === INVISIBLE_SPREAD
          }
        />
      ),

      back: <DiaryIntro />,
    },

    {
      front: (
        <div className="face">
          <div className="paper">

            <InkDiary
              active={turned === 3}
            />

            <div className="folio">
              Page iii, verso
            </div>

          </div>
        </div>
      ),

      back: <SnitchIntro />,
    },

    {
      front: (
        <div className="face">
          <div className="paper">

            <SnitchHunt
              active={turned === 4}
              onCaught={handleSnitchCaught}
            />

            <div className="folio">
              Page iv, verso
            </div>

          </div>
        </div>
      ),

      back: <Closing />,
    },
  ]

  return (
    <div
      className={`act act-book ${
        turned === INVISIBLE_SPREAD
          ? 'wand-zone'
          : ''
      }`}
    >

      <div className="stage">

        <div
          ref={bookRef}
          className={`book ${
            turned > 0 ? 'open' : ''
          } ${
            turned === INVISIBLE_SPREAD
              ? 'flat'
              : ''
          }`}
          onClick={handleBookClick}
        >

          <div className="book-body" />

          <div
            className="leaf"
            style={{
              zIndex: 0,
            }}
          >
            <BackBoard />
          </div>

          {leaves.map((leaf, i) => {
            const flipped =
              i < turned

            return (
              <div
                key={i}
                className={`leaf ${
                  flipped
                    ? 'turned'
                    : ''
                }`}
                style={{
                  zIndex: flipped
                    ? i + 1
                    : LEAVES - i + 1,
                }}
              >
                {leaf.front}
                {leaf.back}
              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}