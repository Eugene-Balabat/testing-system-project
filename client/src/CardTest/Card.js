import { Col } from 'react-bootstrap'

const Card = props => {
  return (
    <div class='col m-0'>
      <div class='card my-3 '>
        <div class='card-body'>
          <h5 class={`card-title ${!props.data.active && ` opacity-50`}`}>
            {props.data.title}
          </h5>
          <p class={`card-text ${!props.data.active && ` opacity-50`}`}>
            {props.data.description}
          </p>
        </div>
        <div class='row card-footer m-0 '>
          <Col className='col-auto p-0 '>
            <small
              className={`text-muted ${!props.data.active && ` opacity-50`}`}
            >
              Обновление {props.data.createdDate}
            </small>
          </Col>
          <Col className='col-auto p-0 ms-auto'>
            <small
              className={`text-muted ${!props.data.active && ` opacity-50`}`}
            >
              Активен до {props.data.closeDate}
            </small>
          </Col>
        </div>
      </div>
    </div>
  )
}

export default Card
