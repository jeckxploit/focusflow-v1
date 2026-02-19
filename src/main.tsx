import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css';
import ReactGA from 'react-ga4'

// Initialize Google Analytics with a placeholder ID
// In production, this should come from process.env.VITE_GA_ID
ReactGA.initialize('G-XXXXXXXXXX')
ReactGA.send('pageview')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)