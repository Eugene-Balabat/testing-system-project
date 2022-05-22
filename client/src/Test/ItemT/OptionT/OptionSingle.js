const OptionSingle = props => {
  return (
    <div className='form-check mb-2'>
      <input
        className={`form-check-input ${
          props.typePage === 'R' && props.data.true && `opacity-100`
        }`}
        type='radio'
        name='flexRadioDefault'
        id={props.data._id}
        aria-describedby={props.idItem}
        checked={props.data.checked}
        disabled={props.role === 'T' || props.role === 'A'}
        onChange={() => {
          props.setOptionState(props.data._id, props.idItem)
        }}
      />
      <label
        className={`form-check-label ${
          props.typePage === 'R' &&
          props.data.true &&
          `text-success fw-bold opacity-75`
        }`}
        for={props.data._id}
      >
        {props.data.answer}
      </label>
    </div>
  )
}

export default OptionSingle
