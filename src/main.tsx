import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Widget from './components/widget/Widget'

createRoot(document.getElementById('frenzy-ai-widget')!).render(
  <StrictMode>
    <Widget />
  </StrictMode>,
)
