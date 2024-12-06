import { createRoot } from 'react-dom/client'
//Router
import { BrowserRouter as Router } from "react-router-dom";

//Styles
import './index.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>,
)
