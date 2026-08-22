import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DemoPresentationProvider } from './context/DemoPresentation'
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

export default function App() {
  return (
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
      <DemoPresentationProvider>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/yacht/coastal" element={<CoastalCharter />} />
        <Route path="/yacht/adventure" element={<BayAdventure />} />
        <Route path="/taxi/mohua" element={<MohuaRide />} />
        <Route path="/taxi/bayhop" element={<BayHop />} />
        <Route path="/handyman/bayfix" element={<BayFix />} />
        <Route path="/handyman/tradeboard" element={<TradeBoard />} />
        <Route path="/pruning/canopy" element={<CanopyCare />} />
        <Route path="/pruning/orchard" element={<OrchardGrid />} />
        <Route path="/painting" element={<EstimatesHub />} />
        <Route path="/painting/freshcoat" element={<FreshCoat />} />
        <Route path="/painting/paintboard" element={<PaintBoard />} />
        <Route path="/fitness/studioflow" element={<StudioFlow />} />
        <Route path="/fitness/classboard" element={<ClassBoard />} />
        <Route path="/riding/shoreride" element={<ShoreRide />} />
        <Route path="/riding/yardboard" element={<YardBoard />} />
        <Route path="/venue/harbourbook" element={<HarbourBook />} />
        <Route path="/venue/hallboard" element={<HallBoard />} />
        <Route path="/beekeeping/hiverun" element={<HiveRun />} />
        <Route path="/beekeeping/apiary" element={<ApiaryBoard />} />
        <Route path="/homecare/visit" element={<CareVisit />} />
        <Route path="/homecare/rounds" element={<RoundBoard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </DemoPresentationProvider>
    </BrowserRouter>
  )
}
