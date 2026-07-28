import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Hub from './pages/Hub'
import CoastalCharter from './pages/yacht/CoastalCharter'
import BayAdventure from './pages/yacht/BayAdventure'
import MohuaRide from './pages/taxi/MohuaRide'
import BayHop from './pages/taxi/BayHop'
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
