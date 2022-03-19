import React from 'react'
import MonthOverview from '../MonthOverview'

const mockItems = [
  {
    name: 'Total Budgeted',
    amount: 112345600
  },
  {
    name: 'Total Spent',
    amount: 112345600
  },
  {
    name: 'Total Balance',
    amount: 112345600
  }

]

export default <MonthOverview items={mockItems}/>
