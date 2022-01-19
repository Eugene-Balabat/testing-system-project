import 'bootstrap/dist/css/bootstrap.min.css'
import AppRoutes from './app-router'
import { BrowserRouter } from 'react-router-dom'

import './stylesheets/custom-bootstrap.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
