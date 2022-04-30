import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AppRoutes from './app-router'
import './stylesheets/custom-bootstrap.css'
import { Context } from './index'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

function App() {
  const { store } = useContext(Context)

  window.store = store // Удалить

  return <AppRoutes />
}

export default observer(App)
