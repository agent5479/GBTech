import { Link } from 'react-router-dom'
import { DemoOutsideShell } from '../../components/DemoChrome'
import { DemoCardImage } from '../../components/DemoHeroImage'

/**
 * Painting estimates landing — two calculators, two jobs.
 */
export default function EstimatesHub() {
  return (
    <div className="hub estimates-hub">
      <DemoOutsideShell />
      <header className="hub-hero demo-enter">
        <div className="hub-hero-copy">
          <p className="demo-badge">Painting estimates · simulated</p>
          <h1>Estimates</h1>
          <p className="estimates-hub-intro">
            Two calculators for a rough sense of cost — indoor rooms, or weatherboards, corrugate, and roof iron.
            Impression only. Not the same wall-area quote with a different skin.
          </p>
        </div>
      </header>
      <div className="estimates-cards">
        <Link to="/painting/freshcoat" className="hub-card hub-card-freshcoat">
          <DemoCardImage id="freshcoat" />
          <span className="hub-kind">Fresh Coat · indoor wizard</span>
          <h2>Indoor rooms</h2>
          <p className="hub-look">Walls · ceilings · skirting · windows · trim</p>
          <p>Measure each surface kind, pick an indoor paint system, and get a ballpark — impression only.</p>
          <span className="hub-go">Open indoor rooms →</span>
        </Link>
        <Link to="/painting/paintboard" className="hub-card hub-card-paintboard">
          <DemoCardImage id="paintboard" />
          <span className="hub-kind">Paint Board · exterior board</span>
          <h2>Weatherboards, corrugate &amp; roof</h2>
          <p className="hub-look">Cladding · roof pitch · fascia</p>
          <p>Profile and pitch stretch paint area. Weathercoat, roof coating, and metal primer — then copy or print.</p>
          <span className="hub-go">Open exterior estimate →</span>
        </Link>
      </div>
    </div>
  )
}
