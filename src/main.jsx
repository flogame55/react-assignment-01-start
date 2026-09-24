import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { TeamProvider } from './context/TeamContext.jsx'

// TODO R4: ครอบด้วย <TeamProvider> — ต้องสูงกว่า Nav และทุกหน้า

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TeamProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TeamProvider>
  </StrictMode>
)

