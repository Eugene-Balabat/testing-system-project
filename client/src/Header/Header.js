import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
  //   NavDropdown,
  //   Form,
  //   FormControl,
  //   Button,
  NavItem
} from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
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

              {/* <NavDropdown title='Dropdown' id='offcanvasNavbarDropdown'>
                <NavDropdown.Item href='#action3'>Action</NavDropdown.Item>
                <NavDropdown.Item href='#action4'>
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='#action5'>
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>

            <div class='d-flex justify-content-center mt-5'>
              <button class='btn btn-outline-secondary px-5' type='button'>
                Создать тест
              </button>
            </div>

            {/* <Form className='d-flex'>
              <FormControl
                type='search'
                placeholder='Search'
                className='me-2'
                aria-label='Search'
              />
              <Button variant='outline-success'>Search</Button>
            </Form> */}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
export default Header
