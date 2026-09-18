// One pointer, one animation loop, one place to keep
// what the reader has done.

// Nothing in here triggers a React render.
// At 60fps that would be the whole budget.

export const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,

  tx: window.innerWidth / 2,
  ty: window.innerHeight / 2,

  lastMove: 0,
  engaged: false,
  downAt: 0,
}

export const wand = {
  lens: 0,
  target: 0,
  base: 150,
  burstUntil: 0,
  live: false,
}

// ----------------------------------------------------
// What the reader leaves behind.
// Finale reads this back to them.
// ----------------------------------------------------

export const lore = {
  lines: [],
  first: null,
}

// Optional future magical particles
export const sparks = []

export function lerp(a, b, t) {
  return a + (b - a) * t
}

const frameSubs = new Set()

export function onFrame(fn) {
  frameSubs.add(fn)

  return () => {
    frameSubs.delete(fn)
  }
}

let running = false

export function startEngine() {
  if (running) return

  running = true

  const move = (x, y) => {
    pointer.tx = x
    pointer.ty = y

    pointer.lastMove = performance.now()
    pointer.engaged = true
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      move(e.clientX, e.clientY)
    }
  )

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches[0]) {
        move(
          e.touches[0].clientX,
          e.touches[0].clientY
        )
      }
    },
    { passive: true }
  )

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches[0]) {
        move(
          e.touches[0].clientX,
          e.touches[0].clientY
        )
      }
    },
    { passive: true }
  )

  window.addEventListener(
    'pointerdown',
    () => {
      wand.burstUntil =
        performance.now() + 620
    }
  )

  const tick = (now) => {
    requestAnimationFrame(tick)

    pointer.x = lerp(
      pointer.x,
      pointer.tx,
      0.19
    )

    pointer.y = lerp(
      pointer.y,
      pointer.ty,
      0.19
    )

    const idle =
      pointer.engaged &&
      now - pointer.lastMove > 3400

    let target = wand.base

    if (now < wand.burstUntil) {
      target = Math.max(
        wand.base,
        520
      )
    } else if (idle) {
      target = 76
    }

    if (
      !wand.live ||
      !pointer.engaged
    ) {
      target = 0
    }

    wand.target = target

    wand.lens = lerp(
      wand.lens,
      wand.target,
      0.1
    )

    frameSubs.forEach((fn) => fn(now))
  }

  requestAnimationFrame(tick)
}