import { NavLink } from 'react-router-dom'
import Card from './Card'

const CardTest = props => {
  return (
    (((props.role === 'S' && props.active) ||
      props.role === 'T' ||
      props.role === 'A') && (
      <NavLink
        to={`/test/${'T'}/${props._id}`}
        className='m-0'
        style={{ textDecoration: 'none', color: 'black' }}
      >
        <Card
          data={{
            title: props.title,
            description: props.description,
            createdDate: props.createdDate,
            closeDate: props.closeDate,
            active: props.active
          }}
        />
      </NavLink>
    )) ||
    (props.role === 'S' && !props.active && (
      <NavLink
        to={`/test/${`R`}/${props.reportid}`}
        className='m-0'
        style={{ textDecoration: 'none', color: 'black' }}
      >
        <Card
          data={{
            title: props.title,
            description: props.description,
            createdDate: props.createdDate,
            closeDate: props.closeDate,
            active: props.active
          }}
        />
      </NavLink>
    ))
  )
}

export default CardTest
