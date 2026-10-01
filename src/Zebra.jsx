// The logo split into 7 pieces. [path, dx, dy] — dx/dy is the direction the
// piece drifts away from the head's center (used by burst/scatter/etc.).
const PIECES = [
  ['M30.58 24.16h13.73l-5.62-5.61-.02-.03h-7.22A9.28 9.28 0 0 0 30.58 0v18.55L15.16 3.17a27.39 27.39 0 0 0-4.8 3.17l14.59 14.54V52.8l11.27 11.27V56.1l-5.64-5.63V24.16Z', -8, -14],
  ['M36.22 24.2l-.03 27.2h5.63l.03-21.55-5.63-5.66Z', 2, -2],
  ['M49.92 29.86l5.63 5.63h-8.07l-5.63-5.63h8.07Z', 12, -8],
  ['M19.31 47.5V23.26L6.37 10.32a28.06 28.06 0 0 0-3.18 4.8l10.49 10.47v7.97L.96 20.84c-.6 2.24-.94 4.6-.96 7.01L19.3 47.5Z', -14, -8],
  ['M47.49 35.5l5.63 5.64v10.3H47.5V35.5Z', 10, 4],
  ['M64.4 44.32h-5.64v7.13h-5.64a9.28 9.28 0 1 0 18.56 0l-7.29-7.13Z', 14, 12],
  ['M.1 43.89v-7.97l36.12 36.11V80L.1 43.89Z', -8, 14],
]

export const NAMES = [
  'Flip', 'Pulse', 'Bounce', 'Burst', 'Ripple', 'Pinwheel', 'Pop-in',
  'Slide Wave', 'Twirl', 'Glitch', 'Color Sweep', 'Pendulum', 'Heartbeat',
  'Rain', 'Spiral', 'Fog', 'Rainbow', 'Card Flip', 'Scatter', 'Jelly', 'Liquid Orbit',
  'Warp', 'Sway', 'Neon', 'Tumble', 'Equalizer', 'Conveyor', 'Mirror', 'Zipper', 'Whirl',
]

// Gooey filter: blur animates so the head is crisp at rest and merges while moving.
const GOO = { dur: '4s', keyTimes: '0;.35;.65;.95;1', values: '0;5;5;0;0' }

const ID = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0'
const THRESH = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'

function Goo({ id }) {
  const { dur, keyTimes, values } = GOO
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0">
        <animate attributeName="stdDeviation" dur={dur} repeatCount="indefinite" keyTimes={keyTimes} values={values} />
      </feGaussianBlur>
      {/* alpha threshold only applies mid-animation; at rest it is the identity matrix so the head is untouched */}
      <feColorMatrix values={ID}>
        <animate attributeName="values" dur={dur} repeatCount="indefinite" keyTimes={keyTimes} values={`${ID};${THRESH};${THRESH};${ID};${ID}`} />
      </feColorMatrix>
    </filter>
  )
}

export default function Zebra({ variant = 1, size = 96 }) {
  const goo = variant === 21 ? 'goo' : null
  return (
    <div className="stage" style={{ width: size, height: size }}>
      <svg className={`z z${variant}`} viewBox="0 0 72 80" height={size} role="img" aria-label="Loading">
        {goo && <Goo id={goo} />}
        <g filter={goo ? `url(#${goo})` : undefined}>
          {PIECES.map(([d, dx, dy], i) => (
            <path key={i} className="p" d={d} style={{ '--i': i, '--dx': dx, '--dy': dy, '--k': i % 2 ? -2 : 1 }} />
          ))}
        </g>
      </svg>
    </div>
  )
}
