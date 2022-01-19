import Login from './Login/Login'
import { Route, Switch, Navigate } from 'react-router-dom'

import Main from './Main/Main'

const AppRoutes = () => {
  return (
    <Switch>
      <Route path='/' exact render={() => <Main />} />
      <Route path='/main' exact render={() => <Main />} />
      <Route path='/login' exact render={() => <Login />} />
      <Navigate to='/' />
    </Switch>
  )
}
export default AppRoutes
