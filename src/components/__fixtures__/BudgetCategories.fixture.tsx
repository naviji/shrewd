import React from 'react'
import BudgetCategories from '../BudgetCategories'
import { useValue } from 'react-cosmos/fixture'
import { nanoid } from 'nanoid'

/* eslint react-hooks/rules-of-hooks: "off" */

const categoryGroup = {
  id: nanoid(),
  name: 'True Expenses',
  spent: 12345600,
  balance: 12345600,
  budgeted: 12345600
}
const mockCategories = [
  {
    id: nanoid(),
    groupId: categoryGroup.id,
    name: 'Electricity',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  },
  {
    id: nanoid(),
    groupId: categoryGroup.id,
    name: 'Rent',
    spent: 12345600,
    balance: 12345600,
    budgeted: 12345600
  }
]

export default {
  default: () => {
    const [categories, setCategories] = useValue('categories', { defaultValue: mockCategories })

    const [expanded, setExpanded] = useValue('expanded', { defaultValue: [categoryGroup.id] })

    const handleChange = (panel: string) => {
      const idx = expanded.indexOf(panel)
      if (idx !== -1) {
        setExpanded(expanded.filter(x => x !== panel))
      } else {
        setExpanded(expanded.concat(panel))
      }
    }

    const setBudgetedById = (id: string, v: number) => {
      const clonedCategories = categories.slice()
      const x = clonedCategories.find(x => x.id === id)
      if (x) {
        x.budgeted = v
      }
      setCategories(clonedCategories)
    }

    const setCategoryNameById = (id: string, v: string) => {
      const clonedCategories = categories.slice()
      const x = clonedCategories.find(x => x.id === id)
      if (x) {
        x.name = v
      }
      setCategories(clonedCategories)
    }

    return <BudgetCategories
                categoryGroup={categoryGroup}
                categories={categories}
                setBudgetedById={setBudgetedById}
                setCategoryNameById={setCategoryNameById}
                expanded={expanded.indexOf(categoryGroup.id) !== -1}
                handleChange={() => {
                  handleChange(categoryGroup.id)
                }}
                />
  }
}
