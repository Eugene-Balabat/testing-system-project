import { Row, Form } from 'react-bootstrap'
import OptionMany from './OptionT/OptionMany'
import OptionSingle from './OptionT/OptionSingle'

const ItemT = props => {
  return (
    <Row className='m-0 mb-5'>
      <Form className='p-0'>
        <Row className='m-0 p-0 '>
          <p class='fs-5 p-0'>{props.text}</p>
        </Row>

        <Row className='m-0 p-0'>
          {props.options.map(option => {
            if (props.type === 'SINGLE')
              return (
                <OptionSingle
                  text={option.text}
                  id={option.id}
                  idItem={props.id}
                />
              )
            else if (props.type === 'MANY')
              return <OptionMany text={option.text} id={option.id} />
            else return <></>
          })}
        </Row>
        <div id={props.id} className='form-text mt-2'>
          {props.optionHelp}
        </div>
      </Form>
    </Row>
  )
}

export default ItemT
