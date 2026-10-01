import { useEffect, useState } from 'react'
import Zebra, { NAMES } from './Zebra.jsx'

// Hash routing (#/12) — no router dependency needed for one detail page.
const useHash = () => {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => { setHash(location.hash); scrollTo(0, 0) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return hash
}

function Detail({ n }) {
  const go = (d) => (location.hash = `#/${((n - 1 + d + NAMES.length) % NAMES.length) + 1}`)
  return (
    <main className="detail">
      <a href="#/">← All spinners</a>
      <h1><b>{String(n).padStart(2, '0')}</b> {NAMES[n - 1]}</h1>
      <Zebra variant={n} size={320} />
      <div className="sizes">
        {[32, 64, 128].map((s) => <Zebra key={s} variant={n} size={s} />)}
      </div>
      <nav>
        <button onClick={() => go(-1)}>← Previous</button>
        <button onClick={() => go(1)}>Next →</button>
      </nav>
    </main>
  )
}

export default function App() {
  const n = Number(useHash().match(/^#\/(\d+)$/)?.[1])
  if (n >= 1 && n <= NAMES.length) return <Detail n={n} />
  return (
    <main>
      <h1>Loading Zebra</h1>
      <p>{NAMES.length} looping spinners. Every one starts and ends as the original head. Click one for its own page.</p>
      <div className="grid">
        {NAMES.map((name, i) => (
          <a key={name} href={`#/${i + 1}`} className="card">
            <figure>
              <Zebra variant={i + 1} />
              <figcaption><b>{String(i + 1).padStart(2, '0')}</b> {name}</figcaption>
            </figure>
          </a>
        ))}
      </div>
    </main>
  )
}
