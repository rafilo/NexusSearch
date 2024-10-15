import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStateProvider } from './redux/provider'
import { Toaster } from 'components/UI/toaster'
import { TooltipProvider } from 'components/UI/tooltip'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <GlobalStateProvider>
    <BrowserRouter>
      <TooltipProvider delayDuration={100}>
        <App />
      </TooltipProvider>
      <Toaster />
    </BrowserRouter>
  </GlobalStateProvider>
)
