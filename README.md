# Unbound

One React + Vite page in three acts. The cursor is a wand the whole way through.

```bash
npm install
npm run dev
```

## Act I — the ledger that lies

A library catalogue that has been doctored. Two identical layouts are stacked and
the top one is masked with a live radial gradient at the pointer, so the page
reads as x-ray rather than a swap. Everywhere the light has already been keeps a
faint ink stain that dries up over about half a minute. Type `lumos`, `nox` or
`alohomora` anywhere.

Somewhere in the lower left, shelf nine holds a book that is warm and should not
be. Find it with the light and take it down.

## Act II — the book

The book opens in 3D. Each leaf is one `<div>` with two faces
(`backface-visibility: hidden`) rotated on `transform-origin: left center`, so
leaf *i* carries the right page of spread *i* and the left page of spread *i+1*.

- **The blank leaf** — this is where the two ideas meet. The same cloak mask from
  Act I, but scoped to one page of the book instead of the window. The tilt is
  switched off on that spread so the light lands exactly under the hand.
- **The ink that will not stay** — write a line and press enter. It sinks through
  the paper and the book answers in its own hand, matched to what you wrote.
- **The snitch** — escapes twice, faster each time. Catch it and the book closes.

## Act III — the ceiling

Candles rise out of the dark, and the first line you wrote in the diary is
written back to you in gold. That is the point of the whole thing: the finale is
not authored, it is whatever the reader left behind.

## Layout

```
src/
  magic.js             one pointer, one rAF loop, and `lore` — what the reader wrote
  useWandLens.js       the reveal mask + fading memory, reusable at any scale
  App.jsx              act routing and the wand ring
  acts/
    Restricted.jsx     Act I
    BookAct.jsx        Act II
    Finale.jsx         Act III
  components/          pages, ledger layers, diary, snitch, sparks, footprints
```

Nothing in the pointer path triggers a React render; masks and transforms are
written straight to style. Arrow keys turn pages. `prefers-reduced-motion` is
respected throughout.
