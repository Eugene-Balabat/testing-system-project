import { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { Row, Col, Container } from 'react-bootstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config'
import api from '../http'
import ItemT from './ItemT/ItemT'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

const Test = () => {
  const { id, type } = useParams()

  const [role, setRole] = useState()
  const [sendStatus, setSendStatus] = useState(false)
  const [toast, setToast] = useState(null)

  const [items, setItems] = useState([])

  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [creator, setCreator] = useState()
  const [date, setDate] = useState()
  const [userData, setUserData] = useState()

  const [optionHelp] = useState({
    single: 'Вам необходимо выбрать один из вышеперечисленных вариантов.',
    many: 'Вам необходимо выбрать один или несколько из вышеперечисленных вариантов.'
  })

  const { store } = useContext(Context)
  const navigate = useNavigate()

  const openRequest = async () => {
    try {
      let response = null

      if (type === 'R') {
        response = await api.get(API_URL + '/api/get/getPersonalReportData', {
          headers: {
            reportid: id
          }
        })
        setTitle(response.data.testData.title)
        setDescription(response.data.testData.description)
        setDate(convertDate(response.data.date))
        setUserData({ ...response.data.user })
        setItems(convertReportItems([...response.data.reportData]))
      } else if (type === 'T') {
        response = await api.get(API_URL + '/api/get/getPersonalTestData', {
          headers: {
            testid: id,
            userid: store.user.id || localStorage.getItem('userid')
          }
        })
        response.data.active === false && navigate('/main')

        setTitle(response.data.testData.title)
        setDescription(response.data.testData.description)
        setCreator(response.data.testData.creator)
        setItems(convertTetsItems(response.data.testData.items))
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
        } else if (error.response.status === 404) {
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

  const convertDate = deffdate => {
    const convertedDate = new Date(Date.parse(deffdate)) // convert db date to milliseconds
    convertedDate.setTime(convertedDate) // convert from milliseconds to full date
    const resDate = new Intl.DateTimeFormat('ru').format(convertedDate) // convert full date to ru segment dat

    return resDate
  }

  const convertReportItems = resitems => {
    resitems.map(item => {
      for (const answer of item.answers) {
        if (item.singleAnswer) {
          if (answer.true && !answer.checked) {
            return (item.warning = true)
          }
        } else {
          if (
            (answer.true && !answer.checked) ||
            (!answer.true && answer.checked)
          )
            return (item.warning = true)
        }
      }
    })

    return [...resitems]
  }

  const convertTetsItems = resitems => {
    const changedItems = []
    for (const item of resitems) {
      const changedAnswers = []
      for (const answer of item.answers) {
        changedAnswers.push({ ...answer, checked: false })
      }
      changedItems.push({
        ...item.question,
        answers: [...changedAnswers],
        warning: false
      })
    }
    return [...changedItems]
  }

  const setOptionState = (idoption, iditem) => {
    const changedItems = [...items]
    for (const item of changedItems) {
      if (item._id === iditem) {
        if (item.singleAnswer) {
          for (const option of item.answers) {
            if (option._id === idoption) option.checked = true
            else option.checked = false
          }
        } else {
          for (const option of item.answers) {
            if (option._id === idoption) option.checked = !option.checked
          }
        }
      }
    }
    setItems([...changedItems])
  }

  const checkItems = () => {
    const changedItems = [...items]
    for (const item of changedItems) {
      if (!checkOptions(item)) item.warning = true
      else item.warning = false
    }
    setItems([...changedItems])
    setSendStatus(true)
  }

  const checkOptions = item => {
    for (const answer of item.answers) {
      if (answer.checked) return true
    }
    return false
  }

  const requestToDelete = async () => {
    try {
      await api.post(API_URL + '/api/post/deleteTest', {
        id
      })

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
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const requestToReport = async () => {
    try {
      await api.post(API_URL + '/api/post/setReport', {
        testid: id,
        userid: store.user.id || localStorage.getItem('userid'),
        data: [...items]
      })

      navigate('/main')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await store.checkAuth()
          checkAuthUser()
        } else if (error.response.status === 400) {
          console.log(error.response.data.message || 'Непредвиденная ошибка')
          setToast({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
        } else if (error.response.status === 409) {
          console.log(error.response.data.message || 'Непредвиденная ошибка')
          setToast({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const checkWarnings = () => {
    for (const item of items) {
      if (item.warning) return true
    }
    return false
  }

  useEffect(() => {
    if (items.length) {
      if (type === 'T')
        localStorage.setItem(
          'datatest',
          JSON.stringify({
            items: [...items],
            title: title,
            description: description,
            creator: creator
          })
        )
      else if (type === 'R')
        localStorage.setItem(
          'datareport',
          JSON.stringify({
            items: [...items],
            title,
            description,
            date,
            userData: userData
          })
        )
      if (sendStatus && type === 'T') {
        setSendStatus(false)
        if (!checkWarnings()) requestToReport()
      }
    }
  }, [items])

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    store.setToastMain(null)
    store.setToastReport(null)

    return () => {
      localStorage.removeItem('datatest')
      localStorage.removeItem('datareport')
    }
  }, [])

  useEffect(() => {
    let data = null

    if (type === 'R') {
      data = JSON.parse(localStorage.getItem('datareport'))

      if (data) {
        setItems([...data.items])
        setTitle(data.title)
        setDescription(data.description)
        setDate(data.date)
        setUserData(data.userData)
      } else openRequest()
    } else if (type === 'T') {
      data = JSON.parse(localStorage.getItem('datatest'))

      if (data) {
        setItems([...data.items])
        setTitle(data.title)
        setDescription(data.description)
        setCreator(data.creator)
      } else openRequest()
    }
  }, [type])

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  useEffect(() => {
    if (store.user.roles.length) {
      setRole(() => {
        const storeRoles = [...toJS(store.user.roles)]
        if (storeRoles.includes('ADMIN')) return 'A'
        else if (storeRoles.includes('USER-T')) return 'T'
        else if (storeRoles.includes('USER-S')) return 'S'
      })
    }
  }, [store.user.roles])

  return (
    <Container className='my-5 w-50'>
      <Row className='m-0 justify-content-center mb-3 '>
        <p className='fs-2 '>{title}</p>
      </Row>

      <Row className='m-0 justify-content-center mb-4'>
        <p className='lh-base'>{description}</p>
      </Row>
      {items.map(item => (
        <ItemT
          currentData={{
            id: item._id,
            title: item.title,
            options: [...item.answers],
            typePage: type,
            type: item.singleAnswer,
            warning: item.warning,
            optionHelp: optionHelp,
            role: role
          }}
          setOptionState={setOptionState}
        />
      ))}
      <Row className='align-items-center m-0 mt-3'>
        {((role === 'T' && type === 'T' && creator === store.user.id) ||
          role === 'A') && (
          <Col className='col-auto p-0 '>
            <div className='btn-group'>
              <button
                type='button'
                className='btn btn-outline-danger dropdown-toggle'
                aria-expanded='false'
                data-bs-toggle='dropdown'
                data-bs-auto-close='outside'
                data-bs-offset='5,8'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  fill='currentColor'
                  className='bi bi-gear m-1'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z'></path>
                  <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z'></path>
                </svg>
                Настройки
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <NavLink
                    to={`/newtest/${id}`}
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <button className='dropdown-item rounded' type='button'>
                      Редактировать тест
                    </button>
                  </NavLink>
                </li>
                <li>
                  <hr className='dropdown-divider' />
                </li>
                <li>
                  <button
                    className='dropdown-item rounded'
                    type='button'
                    onClick={() => {
                      requestToDelete()
                    }}
                  >
                    Удалить тест
                  </button>
                </li>
              </ul>
            </div>
          </Col>
        )}

        <Col className='col-auto p-0 ms-auto'>
          {(role === 'S' && type === 'T' && (
            <button
              className='btn btn-outline-secondary px-4'
              type='button'
              onClick={() => {
                checkItems()
              }}
            >
              Отправить
            </button>
          )) ||
            ((role === 'T' || role === 'A') && type === 'T' && (
              <NavLink
                to={`/result/${id}`}
                className={`btn btn-outline-secondary px-4 ${
                  creator !== store.user.id && role !== 'A' && `disabled`
                }`}
                type='button'
              >
                Результаты
              </NavLink>
            )) ||
            (type === 'R' && userData && (
              <>
                <h5 class='text-muted font-monospace text-end'>{`${userData.surname} ${userData.name} ${userData.patronymic}`}</h5>
                <h5 class='text-muted font-monospace text-end'>{`Класс ${userData.group}`}</h5>
                <h5 class='text-muted font-monospace text-end'>{date}</h5>
              </>
            ))}
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

export default observer(Test)
