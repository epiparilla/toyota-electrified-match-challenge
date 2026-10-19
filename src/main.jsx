import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Kiosk mode: block browser pinch gestures while leaving normal one-finger controls intact.
const preventPinchZoom = (event) => {
  if (event.touches?.length > 1 || event.type.startsWith('gesture')) {
    event.preventDefault()
  }
}

document.addEventListener('gesturestart', preventPinchZoom, { passive: false })
document.addEventListener('gesturechange', preventPinchZoom, { passive: false })
document.addEventListener('gestureend', preventPinchZoom, { passive: false })
document.addEventListener('touchmove', preventPinchZoom, { passive: false })

const isNativeApp = window.Capacitor?.isNativePlatform?.() ?? false

if (!isNativeApp && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error)
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
