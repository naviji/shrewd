import React from 'react'

import store from '../lib/store'

import { Provider } from 'react-redux'

const Decorator = ({ children }: any) => {
  return (
        <Provider store={store}>{children}</Provider>
  )
}

export default Decorator
