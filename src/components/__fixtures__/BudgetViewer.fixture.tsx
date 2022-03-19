import React from 'react'
import BudgetViewer from '../BudgetViewer'
import { useValue } from 'react-cosmos/fixture'
import { nanoid } from 'nanoid'

/* eslint react-hooks/rules-of-hooks: "off" */

const mockCategoryGroups = [
  {
    id: nanoid(),
    name: 'True Expenses'
  },
  {
    id: nanoid(),
    name: 'Wishlist'
  }

]

const mockCategories = [
  {
    id: nanoid(),
    groupId: mockCategoryGroups[0].id,
    name: 'Electricity',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[0].id,
    name: 'Rent',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[0].id,
    name: 'Student Loan',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[0].id,
    name: 'Maintenance',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[1].id,
    name: 'Airpods Pro',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[1].id,
    name: 'Ferrari',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: mockCategoryGroups[1].id,
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
                categoryGroups={mockCategoryGroups}
                setBudgetedById={(a, b) => null}
                setCategoryNameById={(a, b) => null} />
  }
}
