import React from 'react'
import MoneyCell from './MoneyCell'
import store, { State } from '../lib/store'
import { Provider, useSelector, useDispatch } from 'react-redux'

const MockedMoneyCell = ({ editable, colored }: any) => {
  const category = useSelector((state: State) => state.categories[0])
  return (
        <MoneyCell colored={colored} editable={editable} id={category.id} amount={category.budgeted}/>
  )
}

export default {
  default: <MockedMoneyCell editable={false}/>,
  editable: <MockedMoneyCell editable={true}/>,
  colored: <MockedMoneyCell colored={true} editable={false}/>
}
