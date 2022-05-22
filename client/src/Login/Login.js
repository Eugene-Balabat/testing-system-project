import { Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import api from '../http'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

const Login = () => {
  const [inputs, setInputs] = useState(() => {
    return { emailI: '', passwordI: '', rememberI: false }
  })

  const [toast, setToast] = useState(null)

  const { store } = useContext(Context)
  const navigate = useNavigate()

  const clickToAuth = async () => {
    try {
      const response = await api.post(API_URL + '/api/post/auth', {
        email: inputs.emailI,
        password: inputs.passwordI,
        remember: inputs.rememberI
      })

      store.setAuth(true)

      localStorage.setItem('userid', response.data.user.id)
      localStorage.setItem('accestoken', response.data.accesToken)

      navigate('/main')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log(error.response.data.message || 'Непредвиденная ошибка')
          setToast({
            data: error.response.data.message || 'Непредвиденная ошибка'
          })
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

  const setEmailIValue = value => {
    setInputs({ ...inputs, emailI: value })
  }

  const setPasswordIValue = value => {
    setInputs({ ...inputs, passwordI: value })
  }

  const setRememberIValue = value => {
    setInputs({ ...inputs, rememberI: value })
  }

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) {
        await store.checkAuth()
      }
    }

    if (store.user.id || localStorage.getItem('userid')) navigate('/main')

    store.setToastMain(null)
    asyncWrapper()
  }, [])

  useEffect(() => {
    if (store.toasts.auth) {
      setToast({ ...toJS(store.toasts.auth) })
    }
  }, [store.toasts.auth])

  return (
    <div className='d-flex align-items-center'>
      <Container className='w-28'>
        <Row className='my-auto'>
          <Col>
            <div className='border border-3 rounded-3 p-4'>
              <div class='row mb-3'>
                <div className='col'>
                  <FloatingLabel
                    controlId='floatingInput'
                    className='noselect'
                    label='Логин'
                  >
                    <Form.Control
                      type='email'
                      className='rounded-2'
                      placeholder='name@example.com'
                      value={inputs.emailI}
                      onChange={event => setEmailIValue(event.target.value)}
                    />
                  </FloatingLabel>
                  {/* <div id='emailHelp' class='form-text'>
                We'll never share your email with anyone else.
                  </div> */}
                </div>
              </div>
              <div class='row mb-3'>
                <div className='col'>
                  <FloatingLabel
                    controlId='floatingPassword'
                    className='noselect'
                    label='Пароль'
                  >
                    <Form.Control
                      type='password'
                      className='rounded-2'
                      placeholder='Password'
                      value={inputs.passwordI}
                      onChange={event => setPasswordIValue(event.target.value)}
                    />
                  </FloatingLabel>
                </div>
              </div>
              <div class='row'>
                <div className='col-auto px-3 me-auto align-self-center'>
                  <div class='form-check'>
                    <input
                      type='checkbox'
                      class='form-check-input'
                      id='exampleCheck1'
                      onChange={event =>
                        setRememberIValue(event.target.checked)
                      }
                      checked={inputs.rememberI}
                    />
                    <label
                      class='form-check-label noselect'
                      for='exampleCheck1'
                    >
                      Запомнить меня
                    </label>
                  </div>
                </div>
                <div className='col-auto'>
                  <button
                    type='submit'
                    class='btn btn-outline-secondary'
                    onClick={() => clickToAuth()}
                  >
                    Вход
                  </button>
                </div>
              </div>
            </div>
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
    </div>
  )
}

export default observer(Login)
