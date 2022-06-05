import { Row } from 'react-bootstrap'

const OptionRF = props => {
  return (
    <>
      <Row
        className={`m-0 justify-content-evenly p-2 align-items-center border border-3 border-start-0 border-end-0 border-top-0 mb-4  ${
          props.active && `border-info shadow rounded`
        } ${props.warning && `border-danger rounded`}`}
      >
        <div className='col'>
          <input
            className={`border-0 form-control text-center shadow-none `}
            type='text'
            value={props.surname}
            onChange={event =>
              props.setSurnameValue(props.id, event.target.value)
            }
          />
        </div>
        <div className='col'>
          <input
            className={`border-0 form-control text-center shadow-none `}
            type='text'
            value={props.name}
            onChange={event => props.setNameValue(props.id, event.target.value)}
          />
        </div>
        <div className='col'>
          <input
            className={`border-0 form-control text-center shadow-none `}
            type='text'
            value={props.patronymic}
            onChange={event =>
              props.setPatronymicValue(props.id, event.target.value)
            }
          />
        </div>
      </Row>
    </>
  )
}

export default OptionRF
