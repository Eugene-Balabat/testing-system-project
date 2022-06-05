import { Col, Container, Row } from 'react-bootstrap'
import CardTest from '../CardTest/CardTest'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import DropList from '../Common/DropList/DropList'
import { Context } from '../index'
import { useContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import api from '../http'
import { toJS } from 'mobx'
import Cookies from 'js-cookie'

const Main = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [valueList, setValueList] = useState()
  const [currentValue, setCurrentValue] = useState()

  const [role, setRole] = useState()
  const [tests, setTests] = useState([])
  const [output, setOutput] = useState([])
  const [groups, setGroups] = useState([])
  const [toast, setToast] = useState(null)

  const openDeffRequest = async () => {
    try {
      let response = null
      const localtests = []

      //console.log({...Cookies.get()})

      if (role === 'T' || role === 'A') {
        response = await api.get(API_URL + '/api/get/getTests')
        setGroups([...response.data.groups])
      } else if (role === 'S') {
        response = await api.get(API_URL + '/api/get/getPersonalTests', {
          headers: { userid: localStorage.getItem('userid') }
        })
      }

      response.data.tests.forEach(element => {
        localtests.push({
          ...element.test,
          active: element.active,
          reportid: element.reportid
        })
      })

      setTests([...localtests])
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await store.checkAuth()
          checkAuthUser()
        } else if (error.response.status === 404) {
          setToast({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
          console.log(error.response.data.message || 'Непредвиденная ошибка')
        } else
          console.log(error.response.data.message || 'Непредвиденная ошибка')
      } else console.log(error)
    }
  }

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const rebuiltTests = async () => {
    if (role === 'T' || role === 'A') {
      if (currentValue.value === valueList.all.value) setOutput([...tests])
      else if (currentValue.value === valueList.self.value) setSelfStateOutput()
      else if (valueIsClass()) setClassStateOutput()
    } else if (role === 'S') {
      switch (currentValue.value) {
        case valueList.all.value:
          setOutput([...tests])
          break
        case valueList.cancel.value:
          setActiveStateOutput(false)
          break
        case valueList.active.value:
          setActiveStateOutput(true)
          break
      }
    }
  }

  const valueIsClass = () => {
    if (valueList.class.groups.length) {
      for (const element of valueList.class.groups) {
        if (element.value == currentValue.value) {
          return true
        }
      }
    }
    return false
  }

  const setClassStateOutput = () => {
    if (tests.length) {
      const restests = []
      tests.forEach(test => {
        test.groups.forEach(group => {
          if (group === currentValue.value) {
            restests.push(test)
          }
        })
      })
      setOutput([...restests])
    }
  }

  const setActiveStateOutput = activestate => {
    const sorted = []
    tests.forEach(element => {
      if (element.active === activestate) sorted.push(element)
    })
    setOutput([...sorted])
  }

  const setSelfStateOutput = async () => {
    if (localStorage.getItem('userid')) {
      const restests = []
      tests.forEach(element => {
        if (localStorage.getItem('userid') === element.creator)
          restests.push(element)
        setOutput([...restests])
      })
    } else {
      await store.checkAuth()
      checkAuthUser()
    }
  }

  useEffect(() => {
    if (currentValue) {
      if (localStorage.getItem('mainlistvalue')) {
        if (localStorage.getItem('mainlistvalue').value !== currentValue.value)
          localStorage.setItem(
            'mainlistvalue',
            JSON.stringify({ ...currentValue })
          )
      } else
        localStorage.setItem(
          'mainlistvalue',
          JSON.stringify({ ...valueList.all })
        )

      rebuiltTests()
    }
  }, [currentValue])

  useEffect(() => {
    if (tests.length) rebuiltTests()
  }, [tests])

  useEffect(() => {
    if (groups.length) {
      valueList &&
        groups.forEach(element => {
          valueList.class.groups.push({
            title: 'Класс ' + element.value,
            value: element._id
          })
        })
    }
  }, [groups])

  useEffect(() => {
    if (valueList) {
      setCurrentValue(
        JSON.parse(localStorage.getItem('mainlistvalue')) || {
          ...valueList.all
        }
      )
    }
  }, [valueList])

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    store.setToastAuth(null)
    store.setToastReport(null)
  }, [])

  useEffect(() => {
    if (role) openDeffRequest()
  }, [role])

  useEffect(() => {
    if (store.user.roles.length) {
      setRole(() => {
        const storeRoles = [...toJS(store.user.roles)]
        const valueListT = {
          all: { title: 'Все тесты', value: 'all' },
          self: { title: 'Мои тесты', value: 'self' },
          class: { title: 'Классы', value: 'class', groups: [] }
        }
        const valueListS = {
          all: { title: 'Все тесты', value: 'all' },
          cancel: { title: 'Завершенные', value: 'cancel' },
          active: { title: 'Активные', value: 'active' }
        }

        if (storeRoles.includes('ADMIN')) {
          setValueList({ ...valueListT })
          return 'A'
        } else if (storeRoles.includes('USER-T')) {
          setValueList({ ...valueListT })
          return 'T'
        } else if (storeRoles.includes('USER-S')) {
          setValueList({ ...valueListS })
          return 'S'
        }
      })
    }
  }, [store.user.roles])

  useEffect(() => {
    if (store.toasts.main) {
      setToast({ ...toJS(store.toasts.main) })
    }
  }, [store.toasts.main])

  return (
    <Container>
      <div class='row justify-content-end m-0'>
        <div class='col-auto mt-3'>
          <DropList
            userrole={role}
            valueList={valueList}
            currentValue={currentValue}
            setCurrentValue={setCurrentValue}
          />
        </div>
      </div>
      <div class='row row-cols-1 row-cols-md-3 g-4 justify-content-center m-0'>
        {output.map(element => {
          const createdDate = new Date(Date.parse(element.date)) // convert db date to milliseconds
          createdDate.setTime(createdDate) // convert from milliseconds to full date
          const resCreatedDate = new Intl.DateTimeFormat('ru').format(
            createdDate
          ) // convert full date to ru segment date

          const closeDate = new Date(Date.parse(element.dateclose))
          closeDate.setTime(closeDate)
          const resCloseDate = new Intl.DateTimeFormat('ru').format(closeDate)

          return (
            <CardTest
              {...element}
              createdDate={resCreatedDate}
              closeDate={resCloseDate}
              role={role}
            />
          )
        })}
      </div>
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
export default observer(Main)
