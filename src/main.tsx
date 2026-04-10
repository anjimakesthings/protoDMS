import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../references/p2p-tailwind-classes.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
