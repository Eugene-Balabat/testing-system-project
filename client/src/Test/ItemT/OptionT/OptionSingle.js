const OptionSingle = props => {
  return (
    <div className='form-check mb-2'>
      <input
        className='form-check-input '
        type='radio'
        name='flexRadioDefault'
        id={props.data._id}
        aria-describedby={props.idItem}
        checked={props.data.checked}
        disabled={props.role === 'T' && `true`}
        onChange={() => {
          props.setOptionState(props.data._id, props.idItem)
        }}
      />
      <label class='form-check-label' for={props.data._id}>
        {props.data.answer}
      </label>
    </div>
  )
}

export default OptionSingle
