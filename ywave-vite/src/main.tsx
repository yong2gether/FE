import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initializeApi } from './api/services'

initializeApi();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
