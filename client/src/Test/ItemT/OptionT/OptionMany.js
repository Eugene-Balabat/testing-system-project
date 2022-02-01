const OptionMany = props => {
  return (
    <div class='form-check mb-2'>
      <input
        className='form-check-input '
        type='checkbox'
        name='flexRadioDefault'
        id={props.id}
        aria-describedby='optionHelpBlock'
      />
      <label class='form-check-label' for={props.id}>
        {props.text}
      </label>
    </div>
  )
}

export default OptionMany
