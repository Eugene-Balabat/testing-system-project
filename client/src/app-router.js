import { Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Main from './Main/Main'
import Layout from './Layout'
import Test from './Test/Test'
import CreationForm from './CreationForm/CreationForm'
import UserForm from './User/UserForm'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='/main' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/newuser' element={<UserForm />} />
        <Route path='/newtest' element={<CreationForm />}>
          <Route path=':testid' element={<CreationForm />} />
        </Route>
        <Route path='/test/:id' element={<Test />} />
        <Route path='*' element={<Main />} />
      </Route>
    </Routes>
  )
}
export default AppRoutes
