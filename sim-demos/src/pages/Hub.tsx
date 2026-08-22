import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppPreviewOverlay } from '../components/AppPreviewOverlay'
import { DemoCardImage } from '../components/DemoHeroImage'
import { GbtechDemoNav } from '../components/GbtechDemoNav'
import type { DemoImageId } from '../shared/demoAssets'
import { DEMO_FEATURES, ROLE_LABELS, type DemoRole } from '../shared/demoFeatures'

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
    heading: 'Venue booking · Harbour Hall',
    demos: [
      {
        to: '/venue/harbourbook',
        title: 'Book a facility',
        kind: 'Harbour Book · floor plan',
        look: 'Harbour · timber · teal',
        blurb: 'Tap a room on the floor plan, hire window, party size, extras — venue hire UI.',
        card: 'hub-card-harbourbook',
        imageId: 'harbourbook',
      },
      {
        to: '/venue/hallboard',
        title: 'Rooms × hours board',
        kind: 'Hall Board · staff grid',
        look: 'Ink · brass',
        blurb: 'Staff day grid — hold, confirm, or block each room window.',
        card: 'hub-card-hallboard',
        imageId: 'hallboard',
      },
    ],
  },
  {
    heading: 'Beekeeping · BeeMarshall-style',
    demos: [
      {
        to: '/beekeeping/hiverun',
        title: 'Log a yard action',
        kind: 'Hive Run · field phone',
        look: 'Honey · charcoal',
        blurb: 'Cluster map + phone log — Common/All tasks, yard flags, landowner notes.',
        card: 'hub-card-hiverun',
        imageId: 'hiverun',
      },
      {
        to: '/beekeeping/apiary',
        title: 'Yards & week roster',
        kind: 'Apiary Board · dashboard',
        look: 'Wax · forest',
        blurb: 'KPI strip, cluster map, staff × day week grid — management ops.',
        card: 'hub-card-apiary',
        imageId: 'apiary',
      },
    ],
  },
  {
    heading: 'Home-care ops',
    demos: [
      {
        to: '/homecare/visit',
        title: 'Log a visit',
        kind: 'Care Visit · field phone',
        look: 'Sky · soft slate',
        blurb: 'Care-plan card, meds due, grouped ticks, required family hand-off.',
        card: 'hub-card-carevisit',
        imageId: 'carevisit',
      },
      {
        to: '/homecare/rounds',
        title: 'Day round sheet',
        kind: 'Round Board · roster grid',
        look: 'Navy · coral',
        blurb: 'Carers × visit windows — uncovered visits headline the board.',
        card: 'hub-card-rounds',
        imageId: 'rounds',
      },
    ],
  },
  {
    heading: 'Fitness studio',
    demos: [
      {
        to: '/fitness/studioflow',
        title: 'Member pack wallet',
        kind: 'Studio Flow · member',
        look: 'Coral · slate',
        blurb: 'Prepaid credits burn when you book — spots left vs class cap.',
        card: 'hub-card-studioflow',
        imageId: 'studioflow',
      },
      {
        to: '/fitness/classboard',
        title: 'Wall timetable',
        kind: 'Class Board · instructor',
        look: 'Charcoal · lime',
        blurb: 'Fill bars, caps, exercise ticks — run the room from the board.',
        card: 'hub-card-classboard',
        imageId: 'classboard',
      },
    ],
  },
  {
    heading: 'Horse riding',
    demos: [
      {
        to: '/riding/shoreride',
        title: 'Tide-gated beach ride',
        kind: 'Shore Ride · guest',
        look: 'Dune · leather · sea',
        blurb: 'Tide/sun window strip, then horse picker — calendar conflict before confirm.',
        card: 'hub-card-shoreride',
        imageId: 'shoreride',
      },
      {
        to: '/riding/yardboard',
        title: 'Horse week grid',
        kind: 'Yard Board · operator',
        look: 'Timber · straw · brass',
        blurb: 'Horses × days — rest, farrier, farmstay on one planner.',
        card: 'hub-card-yardboard',
        imageId: 'yardboard',
      },
    ],
  },
  {
    heading: 'Yacht charter',
    demos: [
      {
        to: '/yacht/coastal',
        title: 'Skippered bay sail',
        kind: 'Coastal Charter · wizard',
        look: 'Navy · cream · gold',
        blurb: 'Packages, weather veto, blocked calendar — classic skippered hire.',
        card: 'hub-card-coastal',
        imageId: 'coastal',
      },
      {
        to: '/yacht/adventure',
        title: 'Mission deck day',
        kind: 'Bay Adventure · mission',
        look: 'Teal · sand · coral',
        blurb: 'Route-first map, wind/swell gate, crew roles — not another package stepper.',
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
        blurb: 'Phone-shell ride hail — pickup/drop-off, fare breakdown, road-snapped route.',
        card: 'hub-card-mohua',
        imageId: 'mohua',
      },
      {
        to: '/taxi/bayhop',
        title: 'Place-to-place trip board',
        kind: 'Bay Hop · trip board',
        look: 'Charcoal · citrus',
        blurb: 'Tablet place-grid From/To — road path, vehicle cards, time rail.',
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
        blurb: 'Ticket wizard with + Plumbing / + Electrical / + Carpentry chips — then schedule.',
        card: 'hub-card-bayfix',
        imageId: 'bayfix',
      },
      {
        to: '/handyman/tradeboard',
        title: 'Site job board',
        kind: 'Trade Board · board',
        look: 'Graphite · signal orange',
        blurb: 'Pin trade chips on one board — live estimate beside the day rail.',
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
        blurb: 'Species tiles plus quick-add chips — counters and a side estimate panel.',
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
        blurb: 'Walls, ceilings, skirting, windows, trim — indoor paint system and ballpark.',
        card: 'hub-card-freshcoat',
        imageId: 'freshcoat',
      },
      {
        to: '/painting/paintboard',
        title: 'Weatherboards, corrugate & roof',
        kind: 'Paint Board · exterior board',
        look: 'Charcoal · paint yellow',
        blurb: 'Cladding profile, roof pitch, primers — copy or print the impression.',
        card: 'hub-card-paintboard',
        imageId: 'paintboard',
      },
    ],
  },
]

type PreviewState = {
  title: string
  path: string
  frame: 'phone' | 'tablet' | 'browser'
}

const ALL_DEMOS = GROUPS.flatMap((g) => g.demos)

export default function Hub() {
  const [preview, setPreview] = useState<PreviewState | null>(null)

  const featureIndex = useMemo(() => {
    const byRole: Record<DemoRole, typeof ALL_DEMOS> = {
      booking: [],
      estimate: [],
      ops: [],
    }
    for (const demo of ALL_DEMOS) {
      const meta = DEMO_FEATURES[demo.to]
      if (meta) byRole[meta.role].push(demo)
    }
    return byRole
  }, [])

  const openPreview = (demo: (typeof ALL_DEMOS)[number]) => {
    const meta = DEMO_FEATURES[demo.to]
    setPreview({
      title: demo.title,
      path: demo.to,
      frame: meta?.frame ?? 'browser',
    })
  }

  return (
    <div className="hub">
      <GbtechDemoNav />
      <header className="hub-hero demo-enter">
        <div className="hub-hero-copy">
          <p className="demo-badge">GBTech · simulated templates</p>
          <h1>Try a booking or ops demo</h1>
          <p>
            Fully simulated — no live calendar writes, payments, or dispatch. Ten industry verticals, each as two named
            apps. Pairings follow the job: client + staff, dual client booking UIs, dual staff/ops, or indoor vs outdoor
            client jobs — not the same screen twice.
          </p>
          <p className="hub-hero-hint">Click a card to preview the app on its own — or open the full showcase page with pitch and hero.</p>
          <p>
            <Link className="hub-back" to="/painting">
              Painting estimates hub →
            </Link>
          </p>
          <a className="hub-back" href="/#demos">
            ← Back to GBTech
          </a>
        </div>
      </header>

      <section className="hub-feature-index" aria-label="Feature index by demo role">
        <h2 className="hub-theme">Feature showroom</h2>
        <p className="hub-feature-index__lead">
          Each demo adds visible capabilities on top of its core flow — checklists, coverage banners, dispatch strips, and
          confirm gates you can mix into your build.
        </p>
        <div className="hub-feature-index__grid">
          {(Object.keys(featureIndex) as DemoRole[]).map((role) => (
            <article key={role} className={`hub-feature-index__col hub-feature-index__col--${role}`}>
              <h3>{ROLE_LABELS[role]}</h3>
              <ul>
                {featureIndex[role].map((d) => {
                  const meta = DEMO_FEATURES[d.to]
                  return (
                    <li key={d.to}>
                      <button type="button" className="hub-feature-index__link" onClick={() => openPreview(d)}>
                        {d.title}
                      </button>
                      {meta?.features[0] ? <span className="hub-feature-chip">{meta.features[0]}</span> : null}
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {GROUPS.map((group) => (
        <section key={group.heading} className="hub-group">
          <h2 className="hub-theme">{group.heading}</h2>
          <div className="hub-grid">
            {group.demos.map((d) => {
              const meta = DEMO_FEATURES[d.to]
              return (
                <article key={d.to} className={`hub-card ${d.card}`}>
                  <button type="button" className="hub-card-preview" onClick={() => openPreview(d)}>
                    <DemoCardImage id={d.imageId} />
                    {meta ? <span className={`hub-role-tag hub-role-tag--${meta.role}`}>{ROLE_LABELS[meta.role]}</span> : null}
                    <span className="hub-kind">{d.kind}</span>
                    <h2>{d.title}</h2>
                    <p className="hub-look">{d.look}</p>
                    <p>{d.blurb}</p>
                    {meta?.features.length ? (
                      <ul className="hub-feature-tags">
                        {meta.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="hub-go">Preview app →</span>
                  </button>
                  <Link to={d.to} className="hub-showcase-link">
                    Showcase view →
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      ))}

      {preview ? (
        <AppPreviewOverlay
          open
          onClose={() => setPreview(null)}
          title={preview.title}
          path={preview.path}
          frame={preview.frame}
        />
      ) : null}
    </div>
  )
}
