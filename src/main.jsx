import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'

// Use HashRouter for GitHub Pages compatibility
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <App/>
      </AppProvider>
    </HashRouter>
  </StrictMode>,
)
