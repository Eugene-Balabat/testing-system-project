const LiComponent = props => {
  return (
    <li>
      <button
        class='dropdown-item '
        type='button'
        onClick={() => {
          props.changeCurrentValue(props.data)
        }}
      >
        {props.data.title}
      </button>
    </li>
  )
}

export default LiComponent
