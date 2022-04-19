import { Container } from 'react-bootstrap'
import CardTest from '../CardTest/CardTest'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import DropList from '../Common/DropList/DropList'
import { Context } from '../index'
import { useContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import api from '../http'

const Main = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()
  const [tests, setTests] = useState([])

  const openRequest = async () => {
    try {
      const response = await api.get(API_URL + '/api/get/getTests')

      setTests([...response.data.tests])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    openRequest()
  }, [])

  return (
    <Container>
      {}
      <div class='row justify-content-end m-0'>
        <div class='col-auto mt-3'>
          <DropList />
        </div>
      </div>
      <div class='row row-cols-1 row-cols-md-3 g-4 justify-content-center m-0'>
        {tests.map(element => {
          const dateBD = new Date(Date.parse(element.date)) // convert db date to milliseconds
          dateBD.setTime(dateBD) // convert from milliseconds to full date

          const convertedDate = new Intl.DateTimeFormat('ru').format(dateBD) // convert full date to ru segment date

          return <CardTest {...element} date={convertedDate} />
        })}
      </div>
    </Container>
  )
}
export default observer(Main)
