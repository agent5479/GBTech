import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DemoPresentationProvider } from './context/DemoPresentation'
import { ShowcaseShell } from './components/ShowcaseShell'
import Hub from './pages/Hub'
import CoastalCharter from './pages/yacht/CoastalCharter'
import BayAdventure from './pages/yacht/BayAdventure'
import MohuaRide from './pages/taxi/MohuaRide'
import BayHop from './pages/taxi/BayHop'
import BayFix from './pages/handyman/BayFix'
import TradeBoard from './pages/handyman/TradeBoard'
import CanopyCare from './pages/pruning/CanopyCare'
import OrchardGrid from './pages/pruning/OrchardGrid'
import EstimatesHub from './pages/painting/EstimatesHub'
import FreshCoat from './pages/painting/FreshCoat'
import PaintBoard from './pages/painting/PaintBoard'
import StudioFlow from './pages/fitness/StudioFlow'
import ClassBoard from './pages/fitness/ClassBoard'
import ShoreRide from './pages/riding/ShoreRide'
import YardBoard from './pages/riding/YardBoard'
import HarbourBook from './pages/venue/HarbourBook'
import HallBoard from './pages/venue/HallBoard'
import HiveRun from './pages/beekeeping/HiveRun'
import ApiaryBoard from './pages/beekeeping/ApiaryBoard'
import CareVisit from './pages/homecare/CareVisit'
import RoundBoard from './pages/homecare/RoundBoard'
import './styles/demos.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function DemoRoute({ children }: { children: ReactNode }) {
  return <ShowcaseShell>{children}</ShowcaseShell>
}

export default function App() {
  return (
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
      <DemoPresentationProvider>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/yacht/coastal" element={<DemoRoute><CoastalCharter /></DemoRoute>} />
        <Route path="/yacht/adventure" element={<DemoRoute><BayAdventure /></DemoRoute>} />
        <Route path="/taxi/mohua" element={<DemoRoute><MohuaRide /></DemoRoute>} />
        <Route path="/taxi/bayhop" element={<DemoRoute><BayHop /></DemoRoute>} />
        <Route path="/handyman/bayfix" element={<DemoRoute><BayFix /></DemoRoute>} />
        <Route path="/handyman/tradeboard" element={<DemoRoute><TradeBoard /></DemoRoute>} />
        <Route path="/pruning/canopy" element={<DemoRoute><CanopyCare /></DemoRoute>} />
        <Route path="/pruning/orchard" element={<DemoRoute><OrchardGrid /></DemoRoute>} />
        <Route path="/painting" element={<DemoRoute><EstimatesHub /></DemoRoute>} />
        <Route path="/painting/freshcoat" element={<DemoRoute><FreshCoat /></DemoRoute>} />
        <Route path="/painting/paintboard" element={<DemoRoute><PaintBoard /></DemoRoute>} />
        <Route path="/fitness/studioflow" element={<DemoRoute><StudioFlow /></DemoRoute>} />
        <Route path="/fitness/classboard" element={<DemoRoute><ClassBoard /></DemoRoute>} />
        <Route path="/riding/shoreride" element={<DemoRoute><ShoreRide /></DemoRoute>} />
        <Route path="/riding/yardboard" element={<DemoRoute><YardBoard /></DemoRoute>} />
        <Route path="/venue/harbourbook" element={<DemoRoute><HarbourBook /></DemoRoute>} />
        <Route path="/venue/hallboard" element={<DemoRoute><HallBoard /></DemoRoute>} />
        <Route path="/beekeeping/hiverun" element={<DemoRoute><HiveRun /></DemoRoute>} />
        <Route path="/beekeeping/apiary" element={<DemoRoute><ApiaryBoard /></DemoRoute>} />
        <Route path="/homecare/visit" element={<DemoRoute><CareVisit /></DemoRoute>} />
        <Route path="/homecare/rounds" element={<DemoRoute><RoundBoard /></DemoRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </DemoPresentationProvider>
    </BrowserRouter>
  )
}
