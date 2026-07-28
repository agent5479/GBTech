import { Link } from 'react-router-dom'

const DEMOS = [
  {
    to: '/yacht/coastal',
    title: 'Coastal Charter',
    kind: 'Yacht skipper',
    look: 'Navy · cream · gold',
    blurb: 'Luxury skippered sails with blocked calendar, weather strip, and sailing path map.',
  },
  {
    to: '/yacht/adventure',
    title: 'Bay Adventure',
    kind: 'Yacht skipper',
    look: 'Teal · sand · coral',
    blurb: 'Active outdoor charter flow — same simulation, bolder adventure aesthetic.',
  },
  {
    to: '/taxi/mohua',
    title: 'Mohua Ride',
    kind: 'Private taxi',
    look: 'Burgundy · orange',
    blurb: 'Phone-first Golden Bay taxi with distance, fare breakdown, and mini route map.',
  },
  {
    to: '/taxi/bayhop',
    title: 'Bay Hop',
    kind: 'Private taxi',
    look: 'Charcoal · citrus',
    blurb: 'Night-driver taxi UI — same calculator, larger taps and peak energy.',
  },
]

export default function Hub() {
  return (
    <div className="hub">
      <header className="hub-hero">
        <p className="demo-badge">Marshall Solutions · simulated templates</p>
        <h1>Try a booking demo</h1>
        <p>
          Fully simulated — no Google Calendar writes, no payments, no dispatch. Two yacht themes and two
          private-taxi themes for Golden Bay operators.
        </p>
        <a className="hub-back" href="/GBTech/marshall-solutions.html#demos">
          ← Back to Marshall Solutions
        </a>
      </header>
      <div className="hub-grid">
        {DEMOS.map((d) => (
          <Link key={d.to} to={d.to} className="hub-card">
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
