/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { registerServiceWorker } from '@/lib/pwaInstall'

// @skip-protected: Do not remove. Required for React rendering.
registerServiceWorker()
createRoot(document.getElementById('root')!).render(<App />)
