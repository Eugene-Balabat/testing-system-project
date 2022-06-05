import { Row, Col, Form } from 'react-bootstrap'
import OptionCF from './Option/OptionCF'

const ItemCF = props => {
  return (
    <Row
      className={`m-0 justify-content-center mt-3 border border-2 rounded-3 ${
        props.warning && `border-danger`
      }`}
    >
      <Row className='justify-content-end p-0  '>
        <div className='col-auto px-2 '>
          <button
            type='button'
            class='btn-close shadow-none border-0'
            aria-label='Close'
            style={{ width: '0.5em', height: '0.5em' }}
            onClick={() => props.removeItem(props.itemID)}
          ></button>
        </div>
      </Row>
      <Form className='p-3'>
        <Row className='m-0 justify-content-center mb-5 align-items-center p-0'>
          <Col>
            <textarea
              className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-2 rounded-0 ${
                props.question.warning && `border-danger`
              }`}
              placeholder='Текст вопроса'
              rows='1'
              value={props.question.data}
              onInput={event =>
                props.updateItemQuestion(event.target.value, props.itemID)
              }
            ></textarea>
          </Col>
          <Col>
            <select
              className='form-select ms-auto w-75 shadow-none '
              aria-label='Default select example'
              onChange={event =>
                props.updateItemSelectList(event.target.value, props.itemID)
              }
            >
              <option value='1' selected={props.select === '1' ? true : false}>
                Один из списка
              </option>

              <option value='2' selected={props.select === '2' ? true : false}>
                Несколько из списка
              </option>
            </select>
          </Col>
        </Row>
        {props.options.map(option => {
          return (
            <OptionCF
              select={props.select}
              text={option.text}
              true={option.true}
              warning={option.warning}
              optionID={option.id}
              itemID={props.itemID}
              updateOptionText={props.updateOptionText}
              setOptionState={props.setOptionState}
              updateOptionTrueState={props.updateOptionTrueState}
              removeOption={props.removeOption}
            />
          )
        })}
        <Row className='justify-content-end p-0'>
          <div className='col-auto p-0'>
            <button
              class='btn btn-outline-secondary shadow-none border-0 rounded-circle p-1'
              onClick={event => {
                event.preventDefault()
                props.addOption(props.itemID)
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
      </Form>
    </Row>
  )
}

export default ItemCF
