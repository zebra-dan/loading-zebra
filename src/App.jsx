import { useEffect, useRef, useState } from 'react'
import Zebra, { NAMES } from './Zebra.jsx'
import '@zebra-fed/zeta-web/components/button/button.js'
import raw from './zebra.css?raw'

// Copy-paste CSS = shared base + this variant's section + reduced-motion rule, sliced from zebra.css.
const VARS = ':root { --fg:#1d1e23; --accent:#7c5cff; }\n'
const cssFor = (n) => {
  const base = raw.slice(raw.indexOf('.stage'), raw.indexOf('/* 1 '))
  const own = raw.split(/(?=\/\* \d+ )/).find((t) => t.startsWith(`/* ${n} `)).split('@media')[0]
  const rm = raw.match(/@media \(prefers-reduced-motion.*\n/)[0]
  return `${VARS}${base}\n${own.trim()}\n\n${rm}`.trim()
}

function Snippet({ title, code }) {
  const [ok, setOk] = useState(false)
  const copy = () => navigator.clipboard.writeText(code).then(() => { setOk(true); setTimeout(() => setOk(false), 1500) })
  return (
    <section className="snippet">
      <div><h2>{title}</h2><zeta-button flavor="outline" size="small" onClick={copy}>{ok ? 'Copied!' : 'Copy'}</zeta-button></div>
      <pre><code>{code}</code></pre>
    </section>
  )
}

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
  const ref = useRef()
  const [html, setHtml] = useState('')
  useEffect(() => setHtml(ref.current.firstChild.outerHTML.replace(/></g, '>\n<')), [n])
  return (
    <main className="detail">
      <a href="#/">← All spinners</a>
      <h1><b>{String(n).padStart(2, '0')}</b> {NAMES[n - 1]}</h1>
      <div ref={ref}><Zebra variant={n} size={320} /></div>
      <div className="sizes">
        {[32, 64, 128].map((s) => <Zebra key={s} variant={n} size={s} />)}
      </div>
      <Snippet title="HTML" code={html} />
      <Snippet title="CSS" code={cssFor(n)} />
      <nav>
        <zeta-button flavor="outline" onClick={() => go(-1)}>← Previous</zeta-button>
        <zeta-button onClick={() => go(1)}>Next →</zeta-button>
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
      <p>{NAMES.length} looping spinners. Every one starts and ends as the original head. Click one to copy the code snippet.</p>
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
