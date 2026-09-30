/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RecomecaProvider } from '@/lib/recomecaStore'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Hoje from './pages/Hoje'
import Registrar from './pages/Registrar'
import Trocar from './pages/Trocar'
import Diario from './pages/Diario'
import SOS from './pages/SOS'
import Apoio from './pages/Apoio'
import Perfil from './pages/Perfil'
import Plano from './pages/Plano'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <BrowserRouter>
    <RecomecaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/hoje" element={<Hoje />} />
            <Route path="/plano" element={<Plano />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/trocar" element={<Trocar />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/sos" element={<SOS />} />
            <Route path="/apoio" element={<Apoio />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </RecomecaProvider>
  </BrowserRouter>
)

export default App
