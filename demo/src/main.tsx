import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/contract-comparison'>
    {/* The basename is set to '/contract-comparison' to match the Vite base path,
    other wise github pages cant load as the website lives in the reponame*/}
    <App/>
    </BrowserRouter>
  </StrictMode>,
)
