import { useContext, useEffect, useState } from 'react'
import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
  NavItem,
  Row
} from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

const Header = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const [userInfo, setUserInfo] = useState()
  const [role, setRole] = useState(null)

  const clickToLogout = async event => {
    event.preventDefault()
    handleClose()
    await store.logout()
    !store.isAuth && navigate('/login')
  }

  useEffect(() => {
    if (store.user.roles.length) {
      setRole(() => {
        const storeRoles = [...toJS(store.user.roles)]
        if (storeRoles.includes('ADMIN'))
          return { value: 'A', title: 'Администратор' }
        else if (storeRoles.includes('USER-T'))
          return { value: 'T', title: 'Учитель' }
        else if (storeRoles.includes('USER-S'))
          return { value: 'S', title: 'Ученик' }
      })
    } else setRole(null)

    if (store.user.personalinfo) {
      setUserInfo({ ...store.user.personalinfo })
    }
  }, [store.user])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
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
                {store.isAuth && role && role.value === 'A' && (
                  <li class='list-group-item'>
                    <div class='accordion' id='accordionPanelsStayOpenExample'>
                      <div class='accordion-item border-0'>
                        <h2
                          class='accordion-header'
                          id={`panelsStayOpen-headingOne-users`}
                        >
                          <a
                            className='accordion-button collapsed text-decoration-none link-primary p-0 shadow-none bg-transparent '
                            type='button'
                            data-bs-toggle='collapse'
                            data-bs-target={`#panelsStayOpen-collapseOne-users`}
                            aria-expanded='true'
                            aria-controls={`panelsStayOpen-collapseOne-users`}
                          >
                            Пользователи
                          </a>
                        </h2>
                        <div
                          id={`panelsStayOpen-collapseOne-users`}
                          class='accordion-collapse collapse'
                          aria-labelledby={`panelsStayOpen-headingOne-users`}
                        >
                          <div class='accordion-body py-1 px-1 pb-0'>
                            <ul class='list-group list-group-flush'>
                              <li class='list-group-item'>
                                <NavItem>
                                  <NavLink
                                    className='nav-link p-0'
                                    to='/newuser'
                                  >
                                    Добавить пользователя
                                  </NavLink>
                                </NavItem>
                              </li>
                              <li class='list-group-item'>
                                <NavItem>
                                  <NavLink
                                    className='nav-link p-0'
                                    to='/updateuser'
                                  >
                                    Редактировать пользователя
                                  </NavLink>
                                </NavItem>
                              </li>
                              <li class='list-group-item'>
                                <NavItem>
                                  <NavLink
                                    className='nav-link p-0'
                                    to='/removeuser'
                                  >
                                    Удалить пользователя
                                  </NavLink>
                                </NavItem>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
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
            {store.isAuth &&
              role &&
              (role.value === 'T' || role.value === 'A') && (
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
          {role && (
            <div className='p-3 pb-2'>
              <Row>
                <p className='text-muted opacity-75 mb-2'>{`Права: ${role.title}`}</p>
                <p className='opacity-75 text-muted mb-2'>
                  {userInfo &&
                    `Профиль: ${userInfo.surname} ${userInfo.name} ${userInfo.patronymic}`}
                </p>
              </Row>
            </div>
          )}
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
export default observer(Header)
