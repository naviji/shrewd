import React, { useEffect } from 'react'
import store, { setCategories } from '../../../lib/store'

import { Provider, useDispatch } from 'react-redux'

import { nanoid } from 'nanoid'

const defaultCategoryData = {
  name: 'Audible',
  budgeted: 123400,
  spent: 112345600,
  balance: 112345600
}

const initData = {
  default: {
    ...defaultCategoryData,
    id: nanoid(),
    groupId: nanoid()
  },
  editable: {
    ...defaultCategoryData,
    id: nanoid(),
    groupId: nanoid(),
    budgeted: 223400
  },
  colored: {
    ...defaultCategoryData,
    id: nanoid(),
    groupId: nanoid(),
    budgeted: -323400
  }
}

const DataMocker = ({ children }: any) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setCategories({ categories: Object.values(initData) }))
  }, [])

  return (
    <>
      {children}
    </>
  )
}

const Decorator = ({ children }: any) => {
  return (
    <Provider store={store}>
      < DataMocker>
        {children}
      </DataMocker>
    </Provider>
  )
}

export default Decorator
