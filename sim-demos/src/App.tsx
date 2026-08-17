import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import './styles/demos.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
