import { Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_URL } from '../config'

const Login = () => {
  const [inputs, setInputs] = useState(() => {
    return { emailI: '', passwordI: '', rememberI: null }
  })

  const instance = axios.create({
    withCredentials: true
  })

  const clickToAuth = async () => {
    try {
      const response = await instance.post(API_URL + '/api/post/auth', {
        email: inputs.emailI,
        password: inputs.passwordI
      })

      console.log(response.data)

      localStorage.setItem('accestoken', response.data.accesToken)
    } catch (error) {
      console.log(error)
    }
  }

  const getCookie = async () => {
    try {
      const response = await instance.get(API_URL + '/api/get/cookie')

      //console.log(response)
    } catch (error) {
      console.log(error)
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
                <div className='col-auto'>
                  <button
                    type='submit'
                    class='btn btn-outline-secondary'
                    onClick={() => getCookie()}
                  >
                    Получить куки
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
