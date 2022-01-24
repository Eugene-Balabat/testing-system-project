import { Container, Row, Col } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import './index.css'

const Layout = () => {
  return (
    <div className='grid h-100'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
