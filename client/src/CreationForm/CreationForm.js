import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import nextId from 'react-id-generator'
import { Context } from '../index'
import ItemCF from './Item/ItemCF'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import api from '../http'

const CreationForm = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [sendStatus, setSendStatus] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const initialState = {
      items: [],
      title: { data: 'Новый тест', warning: false },
      description: { data: '', warning: false },
      closeDate: { data: '', warning: false },
      groups: { data: [], warning: false }
    }

    const asyncWrapper = async () => {
      if (localStorage.getItem('accestoken')) await store.checkAuth()
      checkAuthUser()
    }
    asyncWrapper()

    if (localStorage.getItem('dataCP')) {
      const data = JSON.parse(localStorage.getItem('dataCP'))
      setFormData({ ...data })
    } else setFormData({ ...initialState })

    return () => {
      localStorage.removeItem('dataCP')
    }
  }, [])

  useEffect(() => {
    if (formData) {
      localStorage.setItem('dataCP', JSON.stringify({ ...formData }))
      if (sendStatus) {
        setSendStatus(false)
        if (!checkWarningsPage()) sendRequest()
      }

      if (!formData.groups.data.length) requestToGetGroups()
    }
  }, [formData])

  const checkAuthUser = () => {
    if (!store.isAuth && !localStorage.getItem('accestoken')) navigate('/login')
  }

  const requestToGetGroups = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getGroups')
      const localGroups = []

      response.data.groups.forEach(element => {
        localGroups.push({ ...element, active: false })
      })

      setFormData({
        ...formData,
        groups: { ...formData.groups, data: [...localGroups] }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const sendRequest = async () => {
    try {
      const exportGroups = []
      const exportQuestions = []

      formData.groups.data.forEach(element => {
        if (element.active) exportGroups.push(element._id)
      })

      formData.items.forEach(element => {
        if (element.select === '1') {
          exportQuestions.push({
            question: element.question.data,
            answers: [...element.options],
            singleAnswer: true
          })
        } else if (element.select === '2') {
          exportQuestions.push({
            question: element.question.data,
            answers: [...element.options],
            singleAnswer: false
          })
        }
      })

      await api.post(API_URL + '/api/post/setNewTest', {
        title: formData.title.data,
        description: formData.description.data,
        dateclose: formData.closeDate.data,
        creator: store.user.id || localStorage.getItem('userid'),
        groups: [...exportGroups],
        questions: [...exportQuestions]
      })

      navigate('/main')
    } catch (error) {
      console.log(error)
    }
  }

  const checkWarningsPage = () => {
    if (
      formData.title.warning ||
      formData.description.warning ||
      formData.groups.warning ||
      formData.closeDate.warning ||
      checkItemsWarnings()
    )
      return true
    else return false
  }

  const checkItemsWarnings = () => {
    for (const item of formData.items) {
      if (item.warning) return true
    }
    return false
  }

  const setWarningsPage = () => {
    const localTitle = { ...formData.title }
    const localDescription = { ...formData.description }
    const localGroups = { ...formData.groups }
    const localDate = { ...formData.closeDate }
    const localItems = [...formData.items]

    localTitle.data === ''
      ? (localTitle.warning = true)
      : (localTitle.warning = false)

    localDescription.data === ''
      ? (localDescription.warning = true)
      : (localDescription.warning = false)

    checkGroups() ? (localGroups.warning = false) : (localGroups.warning = true)

    if (localDate.data === '') localDate.warning = true
    else {
      const dateNow = new Date(Date.now())
      dateNow.setTime(dateNow)

      const convertedDateNow = new Intl.DateTimeFormat('ru').format(dateNow)
      const convertedDateInput = new Intl.DateTimeFormat('ru').format(
        new Date(localDate.data)
      )

      convertedDateNow < convertedDateInput
        ? (localDate.warning = false)
        : (localDate.warning = true)
    }

    localItems.map(item => {
      item.question.data === ''
        ? (item.question.warning = true)
        : (item.question.warning = false)

      item.options.map(option => {
        option.text === '' ? (option.warning = true) : (option.warning = false)
        return option
      })
      return item
    })

    localItems.map(item => {
      item.question.warning ||
      !checkOptions(item) ||
      !checkOptionsTrueState(item)
        ? (item.warning = true)
        : (item.warning = false)
      return item
    })

    setFormData({
      ...formData,
      title: { ...localTitle },
      description: { ...localDescription },
      groups: { ...localGroups },
      closeDate: { ...localDate }
    })
    setSendStatus(true)
  }

  const checkGroups = () => {
    for (const element of formData.groups.data) {
      if (element.active) return true
    }
    return false
  }

  const checkOptions = item => {
    for (const option of item.options) {
      if (option.warning) return false
    }
    return true
  }

  const checkOptionsTrueState = item => {
    if (item.options.length) {
      for (const option of item.options) {
        if (option.true) return true
      }
      return false
    }
    return true
  }

  const removeItem = idItem => {
    setFormData({
      ...formData,
      items: [...formData.items.filter(item => item.id !== idItem)]
    })
  }

  const removeOption = (idItem, idOption) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === idItem) {
            const result = item.options.filter(option => option.id !== idOption)
            item.options = [...result]
          }
          return item
        })
      ]
    })
  }

  const updateOptionText = (idItem, idOption, value) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
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
      ]
    })
  }

  const updateOptionTrueState = (idItem, idOption) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === idItem) {
            item.options.map(option => {
              if (option.id === idOption) {
                option.true = !option.true
              }
              return option
            })
          }
          return item
        })
      ]
    })
  }

  const addOption = (idItem, textOption) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === idItem) {
            item.options.push({
              id: getId(item.options),
              text: textOption,
              warning: false,
              true: false
            })
          }
          return item
        })
      ]
    })
  }

  const updateItemQuestion = (value, idItem) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === idItem) item.question.data = value
          return item
        })
      ]
    })
  }

  const updateItemSelectList = (value, idItem) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === idItem) {
            item.options.map(option => {
              option.true = false
              return option
            })
            item.select = value
          }
          return item
        })
      ]
    })
  }

  const setOptionState = (idoption, iditem) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items.map(item => {
          if (item.id === iditem) {
            if (item.select === '1') {
              item.options.map(option => {
                option.id === idoption
                  ? (option.true = !option.true)
                  : (option.true = false)
                return option
              })
            } else if (item.select === '2') {
              item.options.map(option => {
                option.id === idoption && (option.true = !option.true)
                return option
              })
            }
          }
          return item
        })
      ]
    })
  }

  const setCloseDateData = date => {
    setFormData({
      ...formData,
      closeDate: {
        ...formData.closeDate,
        data: date
      }
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: getId(formData.items),
          options: [],
          question: { data: '', warning: false },
          select: '1',
          warning: false
        }
      ]
    })
  }

  const setClassState = (idClass, state) => {
    setFormData({
      ...formData,
      groups: {
        ...formData.groups,
        data: [
          ...formData.groups.data.map(element => {
            if (element._id === idClass) element.active = state
            return element
          })
        ]
      }
    })
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
    <Container className='my-5 w-50'>
      <Row className='m-0 justify-content-center mb-3 pe-5'>
        <input
          className={`form-control form-control-lg shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 ${
            formData && formData.title.warning && `border-danger`
          }`}
          type='text'
          value={formData && formData.title.data}
          onInput={event => {
            setFormData({
              ...formData,
              title: { ...formData.title, data: event.target.value }
            })
          }}
        />
      </Row>
      <Row className='m-0 justify-content-center mb-4'>
        <textarea
          class={`form-control shadow-none border-2 ${
            formData && formData.description.warning && `border-danger`
          }`}
          placeholder='Добавьте описание'
          id='floatingTextarea2'
          rows='3'
          value={formData && formData.description.data}
          onInput={event => {
            setFormData({
              ...formData,
              description: { ...formData.description, data: event.target.value }
            })
          }}
        ></textarea>
      </Row>
      <Row className='justify-content-end m-0 mt-1'>
        <div class='col-auto p-0 align-self-center'>
          <p
            className={`btn fs-6 mb-1 ${
              (formData && formData.groups.warning && `text-danger`) ||
              `text-secondary`
            }`}
            data-bs-toggle='collapse'
            href='#collapseExample'
            role='button'
            aria-expanded='false'
            aria-controls='collapseExample'
          >
            Выбрать классы
          </p>
        </div>
        <div class='collapse' id='collapseExample'>
          <div
            className={`card rounded-3 ${
              formData && formData.groups.warning && `border-danger`
            }`}
          >
            <div class='row row-cols-1 row-cols-md-auto g-1 justify-content-center card-body m-0'>
              {formData &&
                formData.groups.data.map(group => {
                  return (
                    <div className='col form-check mx-3'>
                      <input
                        className='form-check-input '
                        type='checkbox'
                        name='flexRadioDefault'
                        id={group._id}
                        checked={group.active}
                        aria-describedby='collapseExample'
                        onChange={() => {
                          setClassState(group._id, !group.active)
                        }}
                      />
                      <label className='form-check-label' for={group._id}>
                        {group.value}
                      </label>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </Row>
      {formData &&
        formData.items.map(item => {
          return (
            <ItemCF
              itemID={item.id}
              options={item.options}
              question={item.question}
              select={item.select}
              warning={item.warning}
              removeItem={removeItem}
              addOption={addOption}
              updateOptionText={updateOptionText}
              removeOption={removeOption}
              updateItemQuestion={updateItemQuestion}
              updateItemSelectList={updateItemSelectList}
              updateOptionTrueState={updateOptionTrueState}
              setOptionState={setOptionState}
            />
          )
        })}
      <Row className='justify-content-start m-0 mt-1'>
        <div class='col-auto p-0'>
          <a class='nav-link px-2' role='button' onClick={() => addItem()}>
            Добавить вопрос
          </a>
        </div>
      </Row>
      <Row className='justify-content-end m-0 mt-1'>
        <div class='col-auto p-0'>
          <div class='row'>
            <label
              for='inputDate'
              className={`col-auto col-form-label align-self-center ${
                (formData && formData.closeDate.warning && `text-danger`) ||
                `text-muted`
              }`}
            >
              Дата окончания теста:
            </label>
            <div class='col-auto align-self-center ps-2'>
              <input
                className={`form-control text-muted fs-6 form-control-lg shadow-none border-start-0 border-end-0 border-top-0 border-3 rounded-0 px-2 ${
                  formData && formData.closeDate.warning && `border-danger`
                }`}
                type='date'
                id='inputDate'
                value={formData && formData.closeDate.data}
                onInput={event => {
                  setCloseDateData(event.target.value)
                }}
              />
            </div>
          </div>
        </div>
      </Row>
      <Row className='justify-content-end align-items-center m-0 mt-4'>
        <Col className='col-auto p-0'>
          <button
            class='btn btn-outline-secondary px-4'
            type='button'
            onClick={() => {
              setWarningsPage()
            }}
          >
            Сохранить
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default observer(CreationForm)
