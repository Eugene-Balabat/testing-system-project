import Login from './Login/Login'
import { Route, Routes } from 'react-router-dom'

import Main from './Main/Main'
import Layout from './Layout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='/main' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Main />} />
      </Route>
    </Routes>
  )
}
export default AppRoutes
