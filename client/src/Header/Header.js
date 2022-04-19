import { useContext, useState } from 'react'
import { Navbar, Container, Offcanvas, Nav, NavItem } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'

const Header = () => {
  const { store } = useContext(Context)
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const clickToLogout = async event => {
    event.preventDefault()
    handleClose()
    await store.logout()
    !store.isAuth && navigate('/login')
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    // <Navbar expand={false} style={{ backgroundColor: '#c1c8e4' }}>
    <Navbar bg='light' expand={false}>
      <Container fluid>
        <Navbar.Brand href='#'></Navbar.Brand>
        <Navbar.Toggle
          aria-controls='offcanvasNavbar'
          onClick={() => {
            handleShow()
          }}
        />
        <Navbar.Offcanvas
          id='offcanvasNavbar'
          aria-labelledby='offcanvasNavbarLabel'
          placement='end'
          show={show}
          onHide={handleClose}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id='offcanvasNavbarLabel'>
              Навигация
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className='justify-content-start flex-grow-1 pe-3'>
              <ul class=' list-group list-group-flush'>
                {store.isAuth && (
                  <li class='list-group-item'>
                    <NavItem>
                      <NavLink className='nav-link p-0' to='/main'>
                        Главная
                      </NavLink>
                    </NavItem>
                  </li>
                )}
                <li class='list-group-item'>
                  <NavItem>
                    {store.isAuth ? (
                      <NavLink
                        className='nav-link p-0'
                        to='#'
                        onClick={clickToLogout}
                      >
                        Выход
                      </NavLink>
                    ) : (
                      <NavLink
                        className='nav-link p-0'
                        to='/login'
                        onClick={() => {
                          handleClose()
                        }}
                      >
                        Вход
                      </NavLink>
                    )}
                  </NavItem>
                </li>
              </ul>
            </Nav>
            {store.isAuth && (
              <div class='d-flex justify-content-center mt-5'>
                <NavLink to='/newtest'>
                  <button
                    class='btn btn-outline-secondary px-5'
                    type='button'
                    onClick={() => {
                      handleClose()
                    }}
                  >
                    Создать тест
                  </button>
                </NavLink>
              </div>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
export default observer(Header)
