import { Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Main from './Main/Main'
import Layout from './Layout'
import Test from './Test/Test'
import CreationForm from './CreationForm/CreationForm'
import Result from './Result/Result'
import NewUser from './User/NewUser'
import RemoveUser from './User/RemoveUser'
import UpdateUser from './User/UpdateUser'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Main />} />
        <Route path='/main' element={<Main />} />
        <Route path='/result/:testid' element={<Result />} />
        <Route path='/login' element={<Login />} />
        <Route path='/newuser' element={<NewUser />} />
        <Route path='/removeuser' element={<RemoveUser />} />
        <Route path='/updateuser' element={<UpdateUser />} />
        <Route path='/newtest' element={<CreationForm />}>
          <Route path=':testid' element={<CreationForm />} />
        </Route>
        <Route path='/test' element={<Test />}>
          <Route path=':type/:id' element={<Test />} />
        </Route>
        <Route path='*' element={<Main />} />
      </Route>
    </Routes>
  )
}
export default AppRoutes
