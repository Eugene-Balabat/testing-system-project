import { Navbar, Container, Offcanvas, Nav, NavItem } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    // <Navbar expand={false} style={{ backgroundColor: '#c1c8e4' }}>
    <Navbar bg='light' expand={false}>
      <Container fluid>
        <Navbar.Brand href='#'></Navbar.Brand>
        <Navbar.Toggle aria-controls='offcanvasNavbar' />
        <Navbar.Offcanvas
          id='offcanvasNavbar'
          aria-labelledby='offcanvasNavbarLabel'
          placement='end'
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id='offcanvasNavbarLabel'>
              Навигация
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className='justify-content-start flex-grow-1 pe-3'>
              <ul class=' list-group list-group-flush'>
                <li class='list-group-item'>
                  <NavItem>
                    <NavLink className='nav-link p-0' to='/main'>
                      Главная
                    </NavLink>
                  </NavItem>
                </li>
                <li class='list-group-item'>
                  <NavItem>
                    <NavLink className='nav-link p-0' to='/login'>
                      Вход
                    </NavLink>
                  </NavItem>
                </li>
              </ul>
            </Nav>
            <div class='d-flex justify-content-center mt-5'>
              <NavLink className='' to='/newtest'>
                <button class='btn btn-outline-secondary px-5' type='button'>
                  Создать тест
                </button>
              </NavLink>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
export default Header
