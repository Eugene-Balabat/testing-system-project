import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AppRoutes from './app-router'
import './stylesheets/custom-bootstrap.css'
import { Context } from './index'
import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

function App() {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  window.store = store // Удалить

  useEffect(() => {
    const asyncWrapper = async () => {
      localStorage.getItem('accestoken') && (await store.checkAuth())
      !store.isAuth && navigate('/login')
    }
    asyncWrapper()
  }, [])
  return <AppRoutes />
}

export default observer(App)
