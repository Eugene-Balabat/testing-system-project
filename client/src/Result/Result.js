import { Col, Container, Row } from 'react-bootstrap'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { useContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import api from '../http'
import { toJS } from 'mobx'

const Result = () => {
  const { testid } = useParams()

  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [outputs, setOutputs] = useState([])
  const [reports, setReports] = useState([])

  const [toast, setToast] = useState(null)

  const openResultRequest = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getTestResults', {
        headers: {
          testid
        }
      })

      setReports([...response.data.reports])

      if (localStorage.getItem('resultgroups'))
        setGroups(JSON.parse(localStorage.getItem('resultgroups')))
      else setModifiedGroups([...response.data.groups])
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

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const setModifiedGroups = groupsdb => {
    const groupsM = [
      ...groupsdb.map(groupdb => {
        return { ...groupdb, active: true }
      })
    ]

    setGroups([...groupsM])
  }

  const changeGroupState = idgroup => {
    setGroups([
      ...groups.map(group => {
        if (group._id === idgroup) group.active = !group.active
        return group
      })
    ])
  }

  const setOutpuState = () => {
    const outputsM = []

    groups.forEach(group => {
      reports.forEach(report => {
        if (report.group === group._id)
          group.active && outputsM.push({ ...report })
      })
    })

    setOutputs([...outputsM])
  }

  useEffect(() => {
    if (groups.length) {
      setOutpuState()
      localStorage.setItem('resultgroups', JSON.stringify([...groups]))
    }
  }, [groups])

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()
    openResultRequest()

    store.setToastAuth(null)
    store.setToastMain(null)

    return () => {
      localStorage.removeItem('resultgroups')
    }
  }, [])

  useEffect(() => {
    if (store.toasts.report) {
      setToast({ ...toJS(store.toasts.report) })
    }
  }, [store.toasts.report])

  return (
    <Container>
      <div class='row row-cols-1 row-cols-md-auto g-1 justify-content-center card-body m-0 border border-start-0 border-end-0 border-top-0 border-3 rounded-0'>
        {groups.map(group => {
          return (
            <div className='col form-check mx-3 my-2'>
              <input
                className='form-check-input'
                type='checkbox'
                name='flexRadioDefault'
                id={group._id}
                checked={group.active}
                aria-describedby='collapseExample'
                onChange={() => {
                  changeGroupState(group._id)
                }}
              />
              <label className='form-check-label' for={group._id}>
                {group.value}
              </label>
            </div>
          )
        })}
      </div>
      <div class='row row-cols-1 row-cols-md-3 g-4 justify-content-start m-0'>
        {outputs.map(output => {
          const createdDate = new Date(Date.parse(output.date))
          createdDate.setTime(createdDate)
          const resCreatedDate = new Intl.DateTimeFormat('ru').format(
            createdDate
          )

          return (
            <NavLink
              to={`/test/${`R`}/${output.data.id}`}
              className='m-0'
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div class='col m-0'>
                <div className='card my-3 p-0'>
                  <div class='card-body text-muted'>
                    <h5 class='card-title mb-3'>{`${output.user.surname} ${output.user.name} ${output.user.patronymic}`}</h5>
                    <div class='row justify-content-evenly'>
                      <p
                        className={`card-text col-4 text-center m-0 text-success opacity-75 ${
                          output.data.correct >= output.data.uncorrect &&
                          `fw-bold`
                        }`}
                      >
                        {`Правильных ответов ${output.data.correct}`}
                      </p>
                      <p
                        className={`card-text col-4 text-center m-0 text-danger opacity-75 ${
                          output.data.uncorrect > output.data.correct &&
                          `fw-bold`
                        }`}
                      >
                        {`Ошибочных ответов ${output.data.uncorrect}`}
                      </p>
                    </div>
                  </div>
                  <div class='row card-footer m-0'>
                    <div className='col-auto p-0'>
                      <small class='text-muted p-0'>
                        {`Последнее обновление: ${resCreatedDate}`}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
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
export default observer(Result)
