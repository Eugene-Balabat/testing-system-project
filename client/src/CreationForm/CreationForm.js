import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import nextId from 'react-id-generator'
import { Context } from '../context'
import {} from '../index'
import { useContext } from 'react'

import ItemCF from './Item/ItemCF'

const CreationForm = () => {
  // const { store } = useContext(Context)
  // const navigate = useNavigate()

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('items')
    const initialValue = JSON.parse(saved)
    return initialValue || []
  })

  // useEffect(() => {
  //   const raw = localStorage.getItem('items') || []
  //   setItems(JSON.parse(raw))
  //   console.log(localStorage.getItem('items'))
  //   console.log(items)
  // }, [])

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  const removeItem = idItem => {
    setItems(items.filter(item => item.id !== idItem))
  }

  const removeOption = (idItem, idOption) => {
    setItems(
      items.map(item => {
        if (item.id === idItem) {
          const result = item.options.filter(option => option.id !== idOption)
          item.options = [...result]
        }
        return item
      })
    )
  }

  const updateOptionValue = (idItem, idOption, value) => {
    setItems(
      items.map(item => {
        if (item.id === idItem) {
          item.options.map(option => {
            if (option.id === idOption) {
              option.text = value
            }
            return option
          })
        }
        return item
      })
    )
  }

  const addOption = (idItem, textOption) => {
    setItems(
      items.map(item => {
        if (item.id === idItem) {
          item.options.push({ id: getId(item.options), text: textOption })
        }
        return item
      })
    )
  }

  const getId = mass => {
    let id = nextId()
    mass.forEach(element => {
      if (element.id === id) {
        id = getId(mass)
        return
      }
    })
    return id
  }

  return (
    <>
      <Context.Provider
        value={{ removeItem, updateOptionValue, addOption, removeOption }}
      >
        <Container className='my-5 w-50'>
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
          {items.map(item => {
            return <ItemCF itemID={item.id} options={item.options} />
          })}
          <Row className='justify-content-start align-items-center m-0 mt-1'>
            <div class='col-auto p-0'>
              <a
                class='nav-link px-2'
                role='button'
                onClick={() => {
                  setItems([...items, { id: getId(items), options: [] }])
                }}
              >
                Добавить вопрос
              </a>
            </div>
          </Row>
          <Row className='justify-content-end align-items-center m-0 mt-3'>
            <Col className='col-auto p-0'>
              <button class='btn btn-outline-secondary px-4' type='button'>
                Сохранить
              </button>
            </Col>
          </Row>
        </Container>
      </Context.Provider>
    </>
  )
}

export default CreationForm
