import React, { useEffect } from 'react'
import MoneyCell from './MoneyCell'
import store, { State, setCategories } from '../lib/store'

import { Provider, useDispatch, useSelector } from 'react-redux'

const MockedMoneyCell = ({ editable, colored, dataIdx }: any) => {
  const data = useSelector((state: State) => state.categories.data)
  console.log('data= ', data)
  let moneyCell = null
  if (data && data.length) {
    moneyCell = <MoneyCell colored={colored} editable={editable} id={data[dataIdx].id} amount={data[dataIdx].budgeted}/>
  }
  return (
        <>
        {moneyCell}
        </>
  )
}

export default {
  default: <MockedMoneyCell dataIdx={0} editable={false}/>,
  editable: <MockedMoneyCell dataIdx={1} editable={true}/>,
  colored: <MockedMoneyCell dataIdx={2} colored={true} editable={false}/>
}
