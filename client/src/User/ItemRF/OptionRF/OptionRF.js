import { Row } from 'react-bootstrap'

const OptionRF = props => {
  return (
    <>
      <a
        className={`nav-link p-0`}
        role='button'
        onClick={() => props.changeActiveOptionState(props.id)}
      >
        <Row
          className={`m-0 justify-content-evenly p-2 align-items-center ${
            props.active &&
            ` border border-1 border-bottom-0 border-top-0 border-danger rounded-3`
          }`}
        >
          <div className='col-auto'>
            <span
              className={`${props.active ? `text-danger` : `text-muted`}`}
            >{`${props.surname} ${props.name} ${props.patronymic}`}</span>
          </div>
          <div
            className={`col-auto p-1 bg-opacity-75 rounded w-25 ${
              props.active ? ` bg-danger` : `bg-success`
            }`}
          ></div>
        </Row>
      </a>
    </>
  )
}

export default OptionRF
