import LiComponent from '../LiComponent/LiComponent'

const DropList = props => {
  return (
    <div class='dropdown'>
      <button
        class='btn btn-light dropdown-toggle'
        type='button'
        data-bs-toggle='dropdown'
        aria-expanded='false'
        data-bs-auto-close='outside'
      >
        {props.currentValue && props.currentValue.title}
      </button>
      {(props.userrole === 'S' && props.valueList && (
        <ul class='dropdown-menu'>
          <LiComponent
            data={props.valueList.all}
            changeCurrentValue={props.setCurrentValue}
          />
          <LiComponent
            data={props.valueList.cancel}
            changeCurrentValue={props.setCurrentValue}
          />
          <LiComponent
            data={props.valueList.active}
            changeCurrentValue={props.setCurrentValue}
          />
        </ul>
      )) ||
        ((props.userrole === 'T' || props.userrole === 'A') &&
          props.valueList && (
            <ul class='dropdown-menu'>
              <LiComponent
                data={props.valueList.all}
                changeCurrentValue={props.setCurrentValue}
              />
              <LiComponent
                data={props.valueList.self}
                changeCurrentValue={props.setCurrentValue}
              />

              <li>
                <hr class='dropdown-divider' />
              </li>

              <div class='btn-group px-3 dropend'>
                <button
                  class='btn btn-light dropdown-toggle'
                  type='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                  data-bs-offset='5,5'
                >
                  {(props.valueList && props.valueList.class.title) || 'Классы'}
                </button>
                <ul class='dropdown-menu'>
                  {props.valueList &&
                    props.valueList.class.groups.map(element => {
                      return (
                        <LiComponent
                          data={element}
                          changeCurrentValue={props.setCurrentValue}
                        />
                      )
                    })}
                </ul>
              </div>
            </ul>
          ))}
    </div>
  )
}

export default DropList
