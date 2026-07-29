import { Link } from 'react-router-dom'
import { DemoCardImage } from '../components/DemoHeroImage'
import type { DemoImageId } from '../shared/demoAssets'

const DEMOS: {
  to: string
  title: string
  kind: string
  look: string
  blurb: string
  card: string
  imageId: DemoImageId
}[] = [
  {
    to: '/yacht/coastal',
    title: 'Coastal Charter',
    kind: 'Yacht · wizard',
    look: 'Navy · cream · gold',
    blurb: 'Classic 5-step sail booking — packages, blocked calendar, weather strip, water-only sail path.',
    card: 'hub-card-coastal',
    imageId: 'coastal',
  },
  {
    to: '/yacht/adventure',
    title: 'Bay Adventure',
    kind: 'Yacht · mission deck',
    look: 'Teal · sand · coral',
    blurb: 'Different UI — map-first mission deck with water-only routes, day rail, time chips, and crew stepper.',
    card: 'hub-card-adventure',
    imageId: 'adventure',
  },
  {
    to: '/taxi/mohua',
    title: 'Mohua Ride',
    kind: 'Taxi · phone hail',
    look: 'Burgundy · orange',
    blurb: 'Phone-shell ride hail — pickup/drop-off, fare breakdown, road-snapped OSRM route.',
    card: 'hub-card-mohua',
    imageId: 'mohua',
  },
  {
    to: '/taxi/bayhop',
    title: 'Bay Hop',
    kind: 'Taxi · trip board',
    look: 'Charcoal · citrus',
    blurb: 'Different UI — tablet place-grid From/To board with road path, vehicle cards and time rail.',
    card: 'hub-card-bayhop',
    imageId: 'bayhop',
  },
  {
    to: '/handyman/bayfix',
    title: 'Bay Fix',
    kind: 'Handyman · ticket wizard',
    look: 'Steel · amber',
    blurb: 'Multi-select job types on a classic ticket wizard — plumbing, electrical, carpentry, and more.',
    card: 'hub-card-bayfix',
    imageId: 'bayfix',
  },
  {
    to: '/handyman/tradeboard',
    title: 'Trade Board',
    kind: 'Handyman · board',
    look: 'Graphite · signal orange',
    blurb: 'Different UI — pin multiple job chips on one board with day/time rail and live estimate.',
    card: 'hub-card-tradeboard',
    imageId: 'tradeboard',
  },
  {
    to: '/pruning/canopy',
    title: 'Canopy Care',
    kind: 'Pruning · catalog',
    look: 'Forest · bark',
    blurb: 'Tree pruning catalog with per-type quantity steppers, add-ons, and schedule.',
    card: 'hub-card-canopy',
    imageId: 'canopy',
  },
  {
    to: '/pruning/orchard',
    title: 'Orchard Grid',
    kind: 'Pruning · tile grid',
    look: 'Moss · cream',
    blurb: 'Different UI — species tiles with counters, side panel for schedule and cost bracket.',
    card: 'hub-card-orchard',
    imageId: 'orchard',
  },
  {
    to: '/painting/freshcoat',
    title: 'Fresh Coat',
    kind: 'Painting · quote wizard',
    look: 'Slate · sky',
    blurb: 'Wall sizes, indoor/outdoor, paint types and undercoats — automatic Golden Bay ballpark quote.',
    card: 'hub-card-freshcoat',
    imageId: 'freshcoat',
  },
  {
    to: '/painting/paintboard',
    title: 'Paint Board',
    kind: 'Painting · wall board',
    look: 'Charcoal · paint yellow',
    blurb: 'Different UI — pin wall cards and paint chips with a live ballpark column.',
    card: 'hub-card-paintboard',
    imageId: 'paintboard',
  },
]

export default function Hub() {
  return (
    <div className="hub">
      <header className="hub-hero demo-enter">
        <p className="demo-badge">Marshall Solutions · simulated templates</p>
        <h1>Try a booking demo</h1>
        <p>
          Fully simulated — no Google Calendar writes, no payments, no dispatch. Ten distinct interfaces: yacht,
          taxi, handyman, tree pruning, and painting — each as a classic wizard and a different UI on the same booking
          engine.
        </p>
        <a className="hub-back" href="/GBTech/marshall-solutions.html#demos">
          ← Back to Marshall Solutions
        </a>
      </header>
      <div className="hub-grid">
        {DEMOS.map((d) => (
          <Link key={d.to} to={d.to} className={`hub-card ${d.card}`}>
            <DemoCardImage id={d.imageId} />
            <span className="hub-kind">{d.kind}</span>
            <h2>{d.title}</h2>
            <p className="hub-look">{d.look}</p>
            <p>{d.blurb}</p>
            <span className="hub-go">Open demo →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
