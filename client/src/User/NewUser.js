import { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { Row, Col, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import api from '../http'
import { observer } from 'mobx-react-lite'
import validator from 'validator'

const NewUser = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [sendStatus, setSendStatus] = useState(false)

  const [toast, setToast] = useState(null)

  const initialState = {
    surname: { data: '', warning: false },
    name: { data: '', warning: false },
    patronymic: { data: '', warning: false },
    email: { data: '', warning: false },
    password: { data: '', warning: false },
    groups: { data: [], warning: false, disable: true },
    roles: { data: [], warning: false }
  }

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    if (localStorage.getItem('dataForm')) {
      const data = JSON.parse(localStorage.getItem('dataForm'))
      setFormData({ ...data })
    } else setFormData({ ...initialState })

    store.setToastMain(null)
    store.setToastReport(null)

    return () => {
      localStorage.removeItem('dataForm')
    }
  }, [])

  useEffect(() => {
    if (formData) {
      localStorage.setItem('dataForm', JSON.stringify({ ...formData }))
      if (sendStatus) {
        setSendStatus(false)
        if (!checkWarningsPage()) sendRequest()
      }

      !formData.groups.data.length && requestToGetGroups()
      !formData.roles.data.length && requestToGetRoles()
    }
  }, [formData])

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const sendRequest = async () => {
    try {
      const exportRoles = []
      let exportGroup = null

      formData.roles.data.forEach(element => {
        if (element.active) exportRoles.push(element._id)
      })

      formData.groups.data.forEach(element => {
        if (element.active) exportGroup = element._id
      })

      await api.post(API_URL + '/api/post/setNewUser', {
        surname: formData.surname.data,
        name: formData.name.data,
        patronymic: formData.patronymic.data,
        email: formData.email.data,
        password: formData.password.data,
        group: exportGroup,
        roles: [...exportRoles]
      })

      setToast(null)
      navigate('/main')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await store.checkAuth()
          checkAuthUser()
        } else if (error.response.status === 400) {
          console.log(error.response.data.message || 'Непредвиденная ошибка')
          store.setToastMain({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
          navigate('/main')
        } else if (error.response.status === 409) {
          setToast({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
          console.log(error.response.data.message || 'Непредвиденная ошибка')
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }
  const requestToGetGroups = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getGroups')
      const localGroups = []

      response.data.groups.forEach(element => {
        localGroups.push({ ...element, active: false })
      })

      setFormData({
        ...formData,
        groups: { ...formData.groups, data: [...localGroups] }
      })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await store.checkAuth()
          checkAuthUser()
        } else if (error.response.status === 404) {
          setToast({
            data: 'При загрузке старницы некоторые данные не были найдены, попробуйте презагрузить страницу.'
          })
          console.log(error.response.data.message || 'Непредвиденная ошибка')
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const requestToGetRoles = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getRoles')
      const localRoles = []

      response.data.roles.forEach(element => {
        localRoles.push({ ...element, active: false })
      })

      setFormData({
        ...formData,
        roles: { ...formData.roles, data: [...localRoles] }
      })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await store.checkAuth()
          checkAuthUser()
        } else if (error.response.status === 404) {
          setToast({
            data: 'При загрузке старницы некоторые данные не были найдены, попробуйте презагрузить страницу.'
          })
          console.log(error.response.data.message || 'Непредвиденная ошибка')
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const setWarningsPage = () => {
    const localSurname = { ...formData.surname }
    const localName = { ...formData.name }
    const localPatronymic = { ...formData.patronymic }
    const localEmail = { ...formData.email }
    const localPassword = { ...formData.password }
    const localGroups = { ...formData.groups }
    const localRoles = { ...formData.roles }

    localSurname.data === ''
      ? (localSurname.warning = true)
      : (localSurname.warning = false)

    localName.data === ''
      ? (localName.warning = true)
      : (localName.warning = false)

    localPatronymic.data === ''
      ? (localPatronymic.warning = true)
      : (localPatronymic.warning = false)

    localEmail.data === '' || !validator.isEmail(localEmail.data)
      ? (localEmail.warning = true)
      : (localEmail.warning = false)

    localPassword.data === ''
      ? (localPassword.warning = true)
      : (localPassword.warning = false)

    checkActiveElements([...localRoles.data])
      ? (localRoles.warning = false)
      : (localRoles.warning = true)

    if (!localGroups.disable) {
      checkActiveElements([...localGroups.data])
        ? (localGroups.warning = false)
        : (localGroups.warning = true)
    } else localGroups.warning = false

    setFormData({
      ...formData,
      surname: { ...localSurname },
      name: { ...localName },
      patronymic: { ...localPatronymic },
      email: { ...localEmail },
      password: { ...localPassword },
      groups: { ...localGroups },
      roles: { ...localRoles }
    })
    setSendStatus(true)
  }

  const checkActiveElements = mass => {
    for (const element of mass) {
      if (element.active) return true
    }
    return false
  }

  const checkWarningsPage = () => {
    if (
      formData.surname.warning ||
      formData.name.warning ||
      formData.patronymic.warning ||
      formData.email.warning ||
      formData.password.warning ||
      formData.groups.warning ||
      formData.roles.warning
    )
      return true
    else return false
  }

  const changeRoleState = id => {
    const localGroups = { ...formData.groups }

    setFormData({
      ...formData,
      roles: {
        ...formData.roles,
        data: [
          ...formData.roles.data.map(role => {
            if (role._id === id) {
              role.active = !role.active
              if (
                (role.value === 'USER-T' || role.value === 'ADMIN') &&
                role.active
              ) {
                localGroups.disable = true
                localGroups.data.map(group => {
                  return (group.active = false)
                })
              } else if (role.value === 'USER-S')
                role.active
                  ? (localGroups.disable = false)
                  : (localGroups.disable = true)
            }
            return role
          })
        ]
      },
      groups: { ...localGroups }
    })
  }

  const changeGroupState = id => {
    setFormData({
      ...formData,
      groups: {
        ...formData.groups,
        data: [
          ...formData.groups.data.map(group => {
            group._id === id ? (group.active = true) : (group.active = false)
            return group
          })
        ]
      }
    })
  }

  return (
    <Container className='my-5 w-50'>
      <Form onSubmit={event => event.preventDefault()}>
        <Row className='m-0 justify-content-center mt-5 pe-5'>
          <Col>
            <input
              placeholder='Фамилия'
              value={formData && formData.surname.data}
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
                formData && formData.surname.warning && `is-invalid`
              }`}
              type='text'
              onChange={event => {
                setFormData({
                  ...formData,
                  surname: { ...formData.surname, data: event.target.value }
                })
              }}
            />
          </Col>
          <Col>
            <input
              placeholder='Имя'
              value={formData && formData.name.data}
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
                formData && formData.name.warning && `is-invalid`
              }`}
              type='text'
              onChange={event => {
                setFormData({
                  ...formData,
                  name: { ...formData.name, data: event.target.value }
                })
              }}
            />
          </Col>
          <Col>
            <input
              placeholder='Отчество'
              value={formData && formData.patronymic.data}
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
                formData && formData.patronymic.warning && `is-invalid`
              }`}
              type='text'
              onChange={event => {
                setFormData({
                  ...formData,
                  patronymic: {
                    ...formData.patronymic,
                    data: event.target.value
                  }
                })
              }}
            />
          </Col>
        </Row>

        <Row className='m-0 justify-content-center mt-5 pe-5'>
          <Col>
            <input
              placeholder='Электронная почта'
              value={formData && formData.email.data}
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
                formData && formData.email.warning && `is-invalid`
              }`}
              type='email'
              onChange={event => {
                setFormData({
                  ...formData,
                  email: { ...formData.email, data: event.target.value }
                })
              }}
            />
          </Col>
          <Col>
            <input
              placeholder='Пароль'
              value={formData && formData.password.data}
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
                formData && formData.password.warning && `is-invalid`
              }`}
              type='text'
              onChange={event => {
                setFormData({
                  ...formData,
                  password: { ...formData.password, data: event.target.value }
                })
              }}
            />
          </Col>
        </Row>
        <Row className='m-0 justify-content-center mt-5 pe-5'>
          <Col>
            <div class='col-auto p-0 align-self-center'>
              <p
                className={`btn fs-6 m-0 text-secondary ${
                  formData && formData.roles.warning && `text-danger`
                }`}
                data-bs-toggle='collapse'
                role='button'
                aria-expanded='false'
                data-bs-target='#collapseExample1'
                aria-controls='collapseExample1'
              >
                Выбрать роль
              </p>
            </div>
            <div class='collapse' id='collapseExample1'>
              <div className={`card border-0`}>
                <div class='row row-cols-1 row-cols-md-auto g-1 justify-content-center card-body m-0 py-2'>
                  {formData &&
                    formData.roles.data.map(role => {
                      return (
                        <div className='col form-check mx-3 my-2'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={role._id}
                            checked={role.active}
                            name='flexRadioDefault'
                            aria-describedby='collapseExample'
                            onChange={() => {
                              changeRoleState(role._id)
                            }}
                          />
                          <label
                            className='form-check-label text-muted'
                            for={role._id}
                          >
                            {(role.value === 'USER-S' && 'Ученик') ||
                              (role.value === 'USER-T' && 'Учитель') ||
                              (role.value === 'ADMIN' && 'Админ...')}
                          </label>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div class='col-auto p-0 align-self-center'>
              <p
                className={`btn fs-6 m-0 text-secondary ${
                  formData && formData.groups.disable && `disabled`
                } ${formData && formData.groups.warning && `text-danger`}`}
                data-bs-toggle='collapse'
                role='button'
                aria-expanded='false'
                data-bs-target='#collapseExample2'
                aria-controls='collapseExample2'
              >
                Выбрать класс
              </p>
            </div>
            <div class='collapse' id='collapseExample2'>
              <div className={`card border-0`}>
                <div class='row row-cols-1 row-cols-md-auto g-1 justify-content-center card-body m-0 py-2'>
                  {formData &&
                    formData.groups.data.map(group => {
                      return (
                        <div className='col form-check mx-3 my-2'>
                          <input
                            className='form-check-input'
                            type='radio'
                            id={group._id}
                            name='flexRadioDefault'
                            aria-describedby='collapseExample'
                            checked={group.active}
                            onChange={() => {
                              changeGroupState(group._id)
                            }}
                          />
                          <label
                            className='form-check-label text-muted'
                            for={group._id}
                          >
                            {`Класс ${group.value}`}
                          </label>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className='align-items-center m-0 mt-5'>
          <Col className='col-auto p-0 ms-auto'>
            <button
              className='btn btn-outline-secondary px-4'
              type='submit'
              onClick={() => {
                setWarningsPage()
              }}
            >
              Сохранить
            </button>
          </Col>
        </Row>
        {toast && (
          <Row className='justify-content-center mt-4 '>
            <Col className='col-auto p-0'>
              <p class='text-center text-danger m-0'>{`Во время выполнения запроса произошло исключение: ${toast.data}`}</p>
            </Col>
          </Row>
        )}
      </Form>
    </Container>
  )
}

export default observer(NewUser)
