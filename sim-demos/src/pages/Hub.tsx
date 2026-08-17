import { Link } from 'react-router-dom'
import { DemoCardImage } from '../components/DemoHeroImage'
import type { DemoImageId } from '../shared/demoAssets'

const GROUPS: {
  heading: string
  demos: {
    to: string
    title: string
    kind: string
    look: string
    blurb: string
    card: string
    imageId: DemoImageId
  }[]
}[] = [
  {
    heading: 'Yacht charter',
    demos: [
      {
        to: '/yacht/coastal',
        title: 'Skippered bay sail',
        kind: 'Coastal Charter · wizard',
        look: 'Navy · cream · gold',
        blurb: 'Classic 5-step sail booking — packages, blocked calendar, weather strip, water-only sail path.',
        card: 'hub-card-coastal',
        imageId: 'coastal',
      },
      {
        to: '/yacht/adventure',
        title: 'Map-first adventure day',
        kind: 'Bay Adventure · mission deck',
        look: 'Teal · sand · coral',
        blurb: 'Route on the map first, then day rail, time chips, and crew stepper — same engine, different job feel.',
        card: 'hub-card-adventure',
        imageId: 'adventure',
      },
    ],
  },
  {
    heading: 'Taxi',
    demos: [
      {
        to: '/taxi/mohua',
        title: 'Phone hail',
        kind: 'Mohua Ride · phone hail',
        look: 'Burgundy · orange',
        blurb: 'Phone-shell ride hail — pickup/drop-off, fare breakdown, road-snapped OSRM route.',
        card: 'hub-card-mohua',
        imageId: 'mohua',
      },
      {
        to: '/taxi/bayhop',
        title: 'Place-to-place trip board',
        kind: 'Bay Hop · trip board',
        look: 'Charcoal · citrus',
        blurb: 'Tablet place-grid From/To across named Golden Bay spots — road path, vehicle cards, time rail.',
        card: 'hub-card-bayhop',
        imageId: 'bayhop',
      },
    ],
  },
  {
    heading: 'Handyman',
    demos: [
      {
        to: '/handyman/bayfix',
        title: 'Repair ticket',
        kind: 'Bay Fix · ticket wizard',
        look: 'Steel · amber',
        blurb: 'Ticket wizard with + Plumbing / + Electrical / + Carpentry chips — then schedule and site notes.',
        card: 'hub-card-bayfix',
        imageId: 'bayfix',
      },
      {
        to: '/handyman/tradeboard',
        title: 'Site job board',
        kind: 'Trade Board · board',
        look: 'Graphite · signal orange',
        blurb: 'Pin trade chips on one board — add plumbing, electrical, or carpentry in a tap, live estimate.',
        card: 'hub-card-tradeboard',
        imageId: 'tradeboard',
      },
    ],
  },
  {
    heading: 'Pruning',
    demos: [
      {
        to: '/pruning/canopy',
        title: 'Garden prune catalog',
        kind: 'Canopy Care · catalog',
        look: 'Forest · bark',
        blurb: 'Tree pruning catalog with per-type quantity steppers, add-ons, and schedule.',
        card: 'hub-card-canopy',
        imageId: 'canopy',
      },
      {
        to: '/pruning/orchard',
        title: 'Orchard count grid',
        kind: 'Orchard Grid · tile grid',
        look: 'Moss · cream',
        blurb: 'Species tiles plus + Apple / + Citrus / + Stone fruit chips — counters and a side estimate panel.',
        card: 'hub-card-orchard',
        imageId: 'orchard',
      },
    ],
  },
  {
    heading: 'Painting estimates',
    demos: [
      {
        to: '/painting/freshcoat',
        title: 'Indoor rooms',
        kind: 'Fresh Coat · indoor wizard',
        look: 'Slate · sky',
        blurb: 'Walls, ceilings, skirting, windows, trim — indoor paint system and a ballpark impression.',
        card: 'hub-card-freshcoat',
        imageId: 'freshcoat',
      },
      {
        to: '/painting/paintboard',
        title: 'Weatherboards, corrugate & roof',
        kind: 'Paint Board · exterior board',
        look: 'Charcoal · paint yellow',
        blurb: 'Cladding profile, roof pitch, weathercoat and metal primer — copy or print the impression.',
        card: 'hub-card-paintboard',
        imageId: 'paintboard',
      },
    ],
  },
]

export default function Hub() {
  return (
    <div className="hub">
      <header className="hub-hero demo-enter">
        <p className="demo-badge">Marshall Solutions · simulated templates</p>
        <h1>Try a booking demo</h1>
        <p>
          Fully simulated — no Google Calendar writes, no payments, no dispatch. Five Golden Bay verticals, each as
          two named jobs — a classic wizard and a different interface — not the same screen twice.
        </p>
        <p>
          <Link className="hub-back" to="/painting">
            Painting estimates hub →
          </Link>
        </p>
        <a className="hub-back" href="/GBTech/marshall-solutions.html#demos">
          ← Back to Marshall Solutions
        </a>
      </header>
      {GROUPS.map((group) => (
        <section key={group.heading} className="hub-group">
          <h2>{group.heading}</h2>
          <div className="hub-grid">
            {group.demos.map((d) => (
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
        </section>
      ))}
    </div>
  )
}
