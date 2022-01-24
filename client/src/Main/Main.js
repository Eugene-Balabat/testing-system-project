import { Col, Container, Row } from 'react-bootstrap'
import CardTest from '../CardTest/CardTest'
import { NavLink } from 'react-router-dom'
import DropList from '../Common/DropList/DropList'

const Main = () => {
  return (
    <Container>
      <div class='row justify-content-end m-0'>
        <div class='col-auto mt-3'>
          <DropList />
        </div>
      </div>
      <div class='row row-cols-1 row-cols-md-3 g-4 justify-content-center m-0'>
        <CardTest />
        <CardTest />
        <CardTest />
        <CardTest />
        <CardTest />
      </div>
    </Container>
  )
}
export default Main
