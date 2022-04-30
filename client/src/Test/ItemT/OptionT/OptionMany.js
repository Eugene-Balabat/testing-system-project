const OptionMany = props => {
  return (
    <div className='form-check mb-2'>
      <input
        className='form-check-input '
        type='checkbox'
        name='flexRadioDefault'
        id={props.data._id}
        checked={props.data.checked}
        aria-describedby={props.idItem}
        disabled={props.role === 'T' && `true`}
        onChange={() => {
          props.setOptionState(props.data._id, props.idItem)
        }}
      />
      <label className='form-check-label' for={props.data._id}>
        {props.data.answer}
      </label>
    </div>
  )
}

export default OptionMany
