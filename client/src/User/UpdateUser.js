import { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { Row, Col, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import api from '../http'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import ItemURF from './ItemURF/ItemURF'
import $ from 'jquery'

const RemoveUser = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [pageData, setPageData] = useState([])
  const [sendStatus, setSendStatus] = useState(false)

  const [toast, setToast] = useState(null)

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    store.setToastMain(null)
    store.setToastReport(null)

    return () => {
      localStorage.removeItem('dataForm')
    }
  }, [])

  useEffect(() => {
    if (store.user.roles.length) {
      openRequest()
    }
  }, [store.user.roles])

  useEffect(() => {
    if (pageData.length) {
      if (sendStatus) {
        setSendStatus(false)
        !checkOptionsWarnings() && sendRequest()
      }
    }
  }, [pageData])

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const setWarningsPage = () => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          users: [
            ...element.users.map(user => {
              if (
                user.surname === '' ||
                user.username === '' ||
                user.patronymic === ''
              )
                return { ...user, warning: true }
              return { ...user, warning: false }
            })
          ]
        }
      })
    ])

    setSendStatus(true)
  }

  const checkOptionsWarnings = () => {
    for (const group of pageData) {
      for (const user of group.users) {
        if (user.warning) return true
      }
    }
    return false
  }

  const setSurnameValue = (idoption, value) => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          users: [
            ...element.users.map(user => {
              if (user._id === idoption)
                return { ...user, active: true, surname: value }
              return { ...user }
            })
          ]
        }
      })
    ])
  }

  const setNameValue = (idoption, value) => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          users: [
            ...element.users.map(user => {
              if (user._id === idoption)
                return { ...user, active: true, username: value }
              return { ...user }
            })
          ]
        }
      })
    ])
  }

  const setPatronymicValue = (idoption, value) => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          users: [
            ...element.users.map(user => {
              if (user._id === idoption)
                return { ...user, active: true, patronymic: value }
              return { ...user }
            })
          ]
        }
      })
    ])
  }

  const converteData = maindata => {
    return [
      ...maindata.map(element => {
        return {
          ...element,
          item: {
            ...element.item,
            show: false
          },
          users: [
            ...element.users.map(user => {
              return { ...user, active: false, warning: false }
            })
          ]
        }
      })
    ]
  }

  const changeActiveItemState = iditem => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          item: {
            ...element.item,
            show: iditem === element.item._id ? !element.show : element.show
          }
        }
      })
    ])
  }

  const changeActiveOptionState = idoption => {
    setPageData([
      ...pageData.map(element => {
        return {
          ...element,
          users: [
            ...element.users.map(user => {
              if (user._id === idoption)
                return { ...user, active: !user.active }
              return { ...user }
            })
          ]
        }
      })
    ])
  }

  const jquerySetDeffStateAccordion = () => {
    $('.accordion-collapse').removeClass('show')
    $('.accordion-button').addClass('collapsed')
  }

  const sendRequest = async () => {
    try {
      const users = []

      for (const item of pageData) {
        for (const user of item.users) {
          user.active && !users.includes(user._id) && users.push(user)
        }
      }

      if (users.length) {
        await api.post(API_URL + '/api/post/updateUsers', {
          users
        })

        await openRequest()
        jquerySetDeffStateAccordion()
      }
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
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const openRequest = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getRemoveUserData', {
        headers: {
          userroles: [...toJS(store.user.roles)]
        }
      })

      setPageData([...converteData(response.data)])
      setToast(null)
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
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  return (
    <Container className='my-5 w-50'>
      <Row className='m-0 justify-content-center mt-5 pe-5'>
        <Col>
          <div class='accordion' id='accordionPanelsStayOpenExample'>
            {pageData &&
              pageData.map(element => {
                return (
                  <ItemURF
                    id={element.item._id}
                    value={element.item.value}
                    users={element.users}
                    show={element.item.show}
                    pageType='U'
                    changeActiveOptionState={changeActiveOptionState}
                    changeActiveItemState={changeActiveItemState}
                    setSurnameValue={setSurnameValue}
                    setNameValue={setNameValue}
                    setPatronymicValue={setPatronymicValue}
                  />
                )
              })}
          </div>
        </Col>
      </Row>
      <Row className='align-items-center m-0 mt-5'>
        <Col className='col-auto p-0 ms-auto'>
          <button
            className='btn btn-outline-secondary px-4'
            type='button'
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
    </Container>
  )
}

export default observer(RemoveUser)
