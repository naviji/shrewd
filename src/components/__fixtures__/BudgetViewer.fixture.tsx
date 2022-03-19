import React from 'react'
import BudgetViewer from '../BudgetViewer'
import { useValue } from 'react-cosmos/fixture'
import { nanoid } from 'nanoid'

/* eslint react-hooks/rules-of-hooks: "off" */


const categoryGroup1 = {
  id: nanoid(),
  name: 'True Expenses',
  spent: 12345600,
  balance: 12345600,
  budgeted: 12345600
}
const categoryGroup2 = {
  id: nanoid(),
  name: 'Wishlist',
  spent: 12345600,
  balance: 12345600,
  budgeted: 12345600
}

const mockCategories = [
  {
    id: nanoid(),
    groupId: categoryGroup1.id,
    name: 'Electricity',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup1.id,
    name: 'Rent',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup1.id,
    name: 'Student Loan',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup1.id,
    name: 'Maintenance',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup2.id,
    name: 'Airpods Pro',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup2.id,
    name: 'Ferrari',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup2.id,
    name: 'BMW',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  }
]


export default {
  default: () => {
    return <BudgetViewer
                categories={mockCategories}
                setBudgetedById={(a, b) => null}
                setCategoryNameById={(a, b) => null} />
  }
}
