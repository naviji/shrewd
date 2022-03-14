import React, { useEffect } from 'react'
import MoneyCell from './MoneyCell'
import store, { State, setCategories } from '../lib/store'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { nanoid } from 'nanoid'

const data = [
  {
    id: nanoid(),
    groupId: nanoid(),
    name: 'Audible',
    budgeted: 323400,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: nanoid(),
    name: 'Internet',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: nanoid(),
    name: 'Playstation',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: nanoid(),
    name: 'iphone',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  }
]

const MockedMoneyCell = ({ editable, colored }: any) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCategories({ categories: data }))
  }, [])

  const category = useSelector((state: State) => state.categories.data.length ? state.categories.data[0] : null)

  return (
    category ? <MoneyCell colored={colored} editable={editable} id={category.id} amount={category.budgeted}/> : null
  )
}

export default {
  default: <MockedMoneyCell editable={false}/>,
  editable: <MockedMoneyCell editable={true}/>,
  colored: <MockedMoneyCell colored={true} editable={false}/>
}
