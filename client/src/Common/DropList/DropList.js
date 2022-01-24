import LiComponent from '../LiComponent/LiComponent'

const DropList = () => {
  return (
    <div class='btn-group'>
      <button
        class='btn btn-light dropdown-toggle'
        type='button'
        data-bs-toggle='dropdown'
        aria-expanded='false'
        data-bs-toggle='dropdown'
        data-bs-auto-close='outside'
        aria-expanded='false'
      >
        Мои тесты
      </button>
      <ul class='dropdown-menu'>
        <LiComponent />

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
            Классы
          </button>
          <ul class='dropdown-menu'>
            <LiComponent />
            <LiComponent />
            <LiComponent />
          </ul>
        </div>
      </ul>
    </div>
  )
}

export default DropList
