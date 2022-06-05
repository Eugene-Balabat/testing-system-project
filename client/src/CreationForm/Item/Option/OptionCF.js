import { Row } from 'react-bootstrap'

const OptionCF = props => {
  return (
    <Row className='m-0 justify-content-start mb-4 p-0 align-items-center'>
      <div className='col-auto px-1'>
        {(props.select === '1' && (
          <input
            className='form-check-input '
            type='radio'
            name='flexRadioDefault'
            checked={props.true}
            onChange={() => props.setOptionState(props.optionID, props.itemID)}
          />
        )) ||
          (props.select === '2' && (
            <input
              className='form-check-input '
              type='checkbox'
              name='flexRadioDefault'
              checked={props.true}
              onChange={() =>
                props.setOptionState(props.optionID, props.itemID)
              }
            />
          ))}
      </div>
      <div className='col'>
        <input
          className={`form-control shadow-none border-start-0 border-end-0 border-top-0 border-2 rounded-0 ${
            props.warning && `border-danger`
          }`}
          type='text'
          placeholder='Текст ответа'
          onChange={event =>
            props.updateOptionText(
              props.itemID,
              props.optionID,
              event.currentTarget.value
            )
          }
          value={props.text}
        />
      </div>
      <div className='col-auto '>
        <button
          type='button'
          className='btn-close shadow-none border-0'
          aria-label='Close'
          style={{ width: '0.5em', height: '0.5em' }}
          onClick={() => props.removeOption(props.itemID, props.optionID)}
        ></button>
      </div>
    </Row>
  )
}

export default OptionCF
