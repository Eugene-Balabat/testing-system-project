import { Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap'

const Login = () => {
  return (
    <div className='d-flex align-items-center'>
      <Container className='w-28'>
        <Row className='my-auto'>
          <Col>
            <form className='border border-3 rounded-3 p-4'>
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
                  <button type='button' class='btn btn-outline-secondary '>
                    Вход
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
