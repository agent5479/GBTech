import { Link } from 'react-router-dom'

const DEMOS = [
  {
    to: '/yacht/coastal',
    title: 'Coastal Charter',
    kind: 'Yacht · wizard',
    look: 'Navy · cream · gold',
    blurb: 'Classic 5-step sail booking — packages, blocked calendar, weather strip, water-only sail path.',
    card: 'hub-card-coastal',
  },
  {
    to: '/yacht/adventure',
    title: 'Bay Adventure',
    kind: 'Yacht · mission deck',
    look: 'Teal · sand · coral',
    blurb: 'Different UI — map-first mission deck with water-only routes, day rail, time chips, and crew stepper.',
    card: 'hub-card-adventure',
  },
  {
    to: '/taxi/mohua',
    title: 'Mohua Ride',
    kind: 'Taxi · phone hail',
    look: 'Burgundy · orange',
    blurb: 'Phone-shell ride hail — pickup/drop-off, fare breakdown, road-snapped OSRM route.',
    card: 'hub-card-mohua',
  },
  {
    to: '/taxi/bayhop',
    title: 'Bay Hop',
    kind: 'Taxi · trip board',
    look: 'Charcoal · citrus',
    blurb: 'Different UI — tablet place-grid From/To board with road path, vehicle cards and time rail.',
    card: 'hub-card-bayhop',
  },
]

export default function Hub() {
  return (
    <div className="hub">
      <header className="hub-hero">
        <p className="demo-badge">Marshall Solutions · simulated templates</p>
        <h1>Try a booking demo</h1>
        <p>
          Fully simulated — no Google Calendar writes, no payments, no dispatch. Four distinct interfaces: two yacht
          booking patterns and two private-taxi patterns for Golden Bay operators.
        </p>
        <a className="hub-back" href="/GBTech/marshall-solutions.html#demos">
          ← Back to Marshall Solutions
        </a>
      </header>
      <div className="hub-grid">
        {DEMOS.map((d) => (
          <Link key={d.to} to={d.to} className={`hub-card ${d.card}`}>
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
