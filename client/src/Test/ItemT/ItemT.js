import { Row, Form } from 'react-bootstrap'
import OptionMany from './OptionT/OptionMany'
import OptionSingle from './OptionT/OptionSingle'

const ItemT = props => {
  return (
    <Row className='m-0 mb-5'>
      <Form
        className={`p-0 border-end border-3 ${
          props.currentData.warning && `border-danger `
        }`}
      >
        <Row className='m-0 p-0 px-2'>
          <p className='fs-5 p-0'>{props.currentData.title}</p>
        </Row>
        <Row className='m-0 p-0 px-3'>
          {props.currentData.options.map(option => {
            if (props.currentData.type)
              return (
                <OptionSingle
                  data={option}
                  idItem={props.currentData.id}
                  setOptionState={props.setOptionState}
                  role={props.currentData.role}
                />
              )
            else if (!props.currentData.type)
              return (
                <OptionMany
                  data={option}
                  idItem={props.currentData.id}
                  setOptionState={props.setOptionState}
                  role={props.currentData.role}
                />
              )
            else return <></>
          })}
        </Row>
        <div
          id={props.currentData.id}
          className={`form-text mt-2 ${
            props.currentData.warning && `text-danger`
          }`}
        >
          {props.currentData.type
            ? props.currentData.optionHelp.single
            : props.currentData.optionHelp.many}
        </div>
      </Form>
    </Row>
  )
}

export default ItemT
