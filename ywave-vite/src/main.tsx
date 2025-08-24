import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { userApi } from './api/services'
// import { initializeApi } from './api/services'

// initializeApi();

// 앱 시작 시 저장된 토큰 복원
userApi.restoreToken();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
