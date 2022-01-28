import { useContext } from 'react'
import { Row } from 'react-bootstrap'
import { Context } from '../../context'

const Option = props => {
  const { updateOptionValue, removeOption } = useContext(Context)

  return (
    <Row className='m-0 justify-content-start mb-4 p-0 align-items-center'>
      <div className='col'>
        <input
          className='form-control shadow-none border-start-0 border-end-0 border-top-0 border-2 rounded-0 '
          type='text'
          onChange={event =>
            updateOptionValue(props.id, event.currentTarget.value)
          }
          value={props.text}
        />
      </div>
      <div className='col-auto '>
        <button
          type='button'
          class='btn-close'
          aria-label='Close'
          style={{ width: '0.5em', height: '0.5em' }}
          onClick={() => removeOption(props.id)}
        ></button>
      </div>
    </Row>
  )
}

export default Option
