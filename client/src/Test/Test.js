import { useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import ItemT from './ItemT/ItemT'

const Test = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor?',
      options: [
        {
          id: '1',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        },
        {
          id: '2',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        },
        {
          id: '3',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        }
      ],
      optionHelp: 'Вам необходимо выбрать один из вышеперечисленных вариантов.',
      type: 'SINGLE'
    },
    {
      id: '2',
      text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor?',
      options: [
        {
          id: 'rr',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        },
        {
          id: 'e',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        },
        {
          id: 'w',
          text: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor Vivamus agittis lacus vel augue laoreet rutrum faucibus dolor Vivamus sagittis  lacus vel augue laoreet rutrum faucibus dolor'
        }
      ],
      optionHelp:
        'Вам необходимо выбрать один или несколько из вышеперечисленных вариантов.',
      type: 'MANY'
    }
  ])

  return (
    <Container className='my-5 w-50'>
      <Row className='m-0 justify-content-center mb-3 '>
        <p className='fs-2 '>Название теста</p>
      </Row>

      <Row className='m-0 justify-content-center mb-5'>
        <p class='lh-base'>
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </p>
      </Row>
      {items.map(item => (
        <ItemT
          id={item.id}
          text={item.text}
          options={item.options}
          type={item.type}
          optionHelp={item.optionHelp}
        />
      ))}
      <Row className='align-items-center m-0 mt-3'>
        <Col className='col-auto p-0 '>
          <div class='btn-group'>
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
            <ul class='dropdown-menu'>
              <li>
                <button class='dropdown-item rounded' type='button'>
                  Редактировать тест
                </button>
              </li>
              <li>
                <hr class='dropdown-divider' />
              </li>
              <li>
                <button class='dropdown-item rounded' type='button'>
                  Удалить тест
                </button>
              </li>
            </ul>
          </div>
        </Col>
        <Col className='col-auto p-0 ms-auto'>
          <button class='btn btn-outline-secondary px-4' type='button'>
            Отправить
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default Test
