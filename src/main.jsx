import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Last resort for errors outside the weather card's own boundary */}
    <ErrorBoundary fallback={<p role="alert">Something went wrong. Please reload the page.</p>}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
