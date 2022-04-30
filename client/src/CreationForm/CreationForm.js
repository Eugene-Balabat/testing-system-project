import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import nextId from 'react-id-generator'
import { Context } from '../index'
import ItemCF from './Item/ItemCF'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

const CreationForm = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [title, setTitle] = useState('Новый тест')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    if (localStorage.getItem('dataCP')) {
      const data = JSON.parse(localStorage.getItem('dataCP'))

      console.log(data)
      setItems(data.items)
      setTitle(data.title)
      setDescription(data.description)
    }

    return () => {
      localStorage.removeItem('dataCP')
    }
  }, [])

  useEffect(() => {
    if (items.length) {
      localStorage.setItem(
        'dataCP',
        JSON.stringify({ items, title, description })
      )
    }
  }, [items])

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const removeItem = idItem => {
    setItems([...items.filter(item => item.id !== idItem)])
  }

  const removeOption = (idItem, idOption) => {
    setItems([
      ...items.map(item => {
        if (item.id === idItem) {
          const result = item.options.filter(option => option.id !== idOption)
          item.options = [...result]
        }
        return item
      })
    ])
  }

  const updateOptionValue = (idItem, idOption, value) => {
    setItems([
      ...items.map(item => {
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
    ])
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
      <Container className='my-5 w-50'>
        <Row className='m-0 justify-content-center mb-3 pe-5'>
          <input
            className='form-control form-control-lg shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 '
            type='text'
            value={title}
            onInput={event => setTitle(event.target.value)}
          />
        </Row>
        <Row className='m-0 justify-content-center mb-5'>
          <textarea
            class='form-control shadow-none border-2'
            placeholder='Добавьте описание'
            id='floatingTextarea2'
            rows='3'
            value={description}
            onInput={event => setDescription(event.target.value)}
          ></textarea>
        </Row>
        {items.map(item => {
          return (
            <ItemCF
              itemID={item.id}
              options={item.options}
              removeItem={removeItem}
              addOption={addOption}
              updateOptionValue={updateOptionValue}
              removeOption={removeOption}
            />
          )
        })}
        <Row className='justify-content-start align-items-center m-0 mt-1'>
          <div class='col-auto p-0'>
            <a
              class='nav-link px-2'
              role='button'
              onClick={() =>
                setItems([...items, { id: getId(items), options: [] }])
              }
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
    </>
  )
}

export default observer(CreationForm)
