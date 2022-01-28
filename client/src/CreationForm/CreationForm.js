import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import nextId from 'react-id-generator'
import Option from './Option/Option'
import '../index.css'
import { Context } from '../context'

var _ = require('lodash')

const CreationForm = () => {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('options') || []
    setOptions(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('options', JSON.stringify(options))
  }, [options])

  const updateOptionValue = (id, value) => {
    setOptions(
      options.map(option => {
        if (option.id === id) {
          console.log(option.id + ' ' + id)
          option.text = value
        }
        return option
      })
    )
    console.log(options)
  }

  const removeOption = id => {
    setOptions(options.filter(option => option.id !== id))
  }

  const getId = () => {
    let id = nextId()
    options.forEach(element => {
      if (element.id === id) {
        id = getId()
        return
      }
    })
    return id
  }

  return (
    <Context.Provider value={{ updateOptionValue, removeOption }}>
      <Container className='mt-5 w-50'>
        <Row className='m-0 justify-content-center mb-3 pe-5'>
          <input
            className='form-control form-control-lg shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 '
            type='text'
            defaultValue='Новый тест'
          />
        </Row>
        <Row className='m-0 justify-content-center mb-5'>
          <textarea
            class='form-control shadow-none border-2'
            placeholder='Добавьте описание'
            id='floatingTextarea2'
            rows='3'
          ></textarea>
        </Row>
        <Row className='m-0 justify-content-center mb-3 p-3 border border-2 rounded-3'>
          <Row className='m-0 justify-content-center mb-5 align-items-center p-0'>
            <Col>
              <textarea
                className='form-control shadow-none border-start-0 border-end-0 border-top-0 border-2 rounded-0'
                placeholder='Текст вопроса'
                rows='1'
              ></textarea>
            </Col>
            <Col>
              <select
                className='form-select ms-auto w-75 shadow-none '
                aria-label='Default select example'
              >
                <option value='1' selected>
                  Один из списка
                </option>
                <option value='2'>Несколько из списка</option>
              </select>
            </Col>
          </Row>
          {options.map(option => {
            return <Option text={option.text} id={option.id} />
          })}
          <Row className='justify-content-end p-0'>
            <div className='col-auto p-0'>
              <button
                class='btn btn-outline-secondary shadow-none border-0 rounded-circle p-1'
                onClick={() => {
                  setOptions([
                    ...options,
                    { id: getId(), text: 'Текст ответа' }
                  ])
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='2em'
                  height='2em'
                  fill='currentColor'
                  class='bi bi-plus'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
                </svg>
              </button>
            </div>
          </Row>
        </Row>
      </Container>
    </Context.Provider>
  )
}

export default CreationForm
