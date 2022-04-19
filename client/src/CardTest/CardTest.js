import { NavLink } from 'react-router-dom'

const CardTest = props => {
  return (
    <NavLink
      to={`/test/${props._id}`}
      className='m-0'
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <div class='col m-0'>
        <div class='card  my-3 '>
          {/* <img src='...' class='card-img-top' alt='...' /> */}
          <div class='card-body'>
            <h5 class='card-title'>{props.title}</h5>
            <p class='card-text'>{props.description}</p>
          </div>
          <div class='card-footer'>
            <small class='text-muted'>Последнее обновление {props.date}</small>
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default CardTest
