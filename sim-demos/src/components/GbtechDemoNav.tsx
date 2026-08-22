import { Link } from 'react-router-dom'
import { useDemoPresentation } from '../context/DemoPresentation'

/** Sticky GBTech chrome — stays visible while browsing demos. */
export function GbtechDemoNav() {
  const { showShowcaseChrome } = useDemoPresentation()
  if (!showShowcaseChrome) return null

  return (
    <nav className="gbtech-demo-nav" aria-label="GBTech demo navigation">
      <div className="gbtech-demo-nav__inner">
        <a className="gbtech-demo-nav__brand" href="/">
          <strong>GBTech</strong>
          <span> · Simulated booking demos</span>
        </a>
        <div className="gbtech-demo-nav__links">
          <Link to="/">All demos</Link>
          <a href="/#packages">Web &amp; Digital</a>
          <a href="/#demos">Main site</a>
        </div>
      </div>
    </nav>
  )
}
