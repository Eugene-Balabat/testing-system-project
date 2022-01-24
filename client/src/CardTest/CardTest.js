const CardTest = () => {
  return (
    <div class='col m-0'>
      <div class='card  my-3 '>
        {/* <img src='...' class='card-img-top' alt='...' /> */}
        <div class='card-body'>
          <h5 class='card-title'>Название карточки</h5>
          <p class='card-text'>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
          </p>
        </div>
        <div class='card-footer'>
          <small class='text-muted'>Last updated 3 mins ago</small>
        </div>
      </div>
    </div>
  )
}

export default CardTest
