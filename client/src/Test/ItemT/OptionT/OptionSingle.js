const OptionSingle = props => {
  return (
    <div class='form-check mb-2'>
      <input
        className='form-check-input '
        type='radio'
        name='flexRadioDefault'
        id={props.id}
        aria-describedby={props.idItem}
      />
      <label class='form-check-label' for={props.id}>
        {props.text}
      </label>
    </div>
  )
}

export default OptionSingle
