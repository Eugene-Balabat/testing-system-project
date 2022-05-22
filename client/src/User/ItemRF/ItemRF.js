import { Row, Col, Form } from 'react-bootstrap'
import OptionRF from './OptionRF/OptionRF'

const ItemRF = props => {
  return (
    <div class='accordion-item border-0'>
      <h2 class='accordion-header' id={`panelsStayOpen-headingOne-${props.id}`}>
        <button
          className='accordion-button collapsed px-3 py-2 shadow-none text-muted font-monospace'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#panelsStayOpen-collapseOne-${props.id}`}
          aria-expanded='true'
          aria-controls={`panelsStayOpen-collapseOne-${props.id}`}
        >
          {`Роль пользователей: ${
            (props.value === 'USER-T' && 'Учитель') ||
            (props.value === 'ADMIN' && `Администратор`) ||
            `Класс ${props.value}`
          }  `}
        </button>
      </h2>
      <div
        id={`panelsStayOpen-collapseOne-${props.id}`}
        class='accordion-collapse collapse'
        aria-labelledby={`panelsStayOpen-headingOne-${props.id}`}
      >
        <div class='accordion-body'>
          {props.users.map((element, index) => {
            return (
              <>
                <OptionRF
                  id={element._id}
                  name={element.username}
                  surname={element.surname}
                  patronymic={element.patronymic}
                  active={element.active}
                  changeActiveOptionState={props.changeActiveOptionState}
                />

                {index !== props.users.length - 1 && (
                  <Row className='border border-1 my-2 mx-4'></Row>
                )}
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ItemRF
