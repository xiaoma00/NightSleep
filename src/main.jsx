import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fix mobile 100vh issues by setting --vh to 1% of the innerHeight
function setVh() {
  if (typeof window !== 'undefined' && window.document) {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
setVh();
window.addEventListener('resize', setVh);

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
