import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import BudgetCategories from './BudgetCategories'

function uniq (a) {
  return Array.from(new Set(a))
}

const BudgetViewer = ({ categories, setBudgetedById, setCategoryNameById }: any) => {
  const groupIds = uniq(categories.map(x => x.groupId))
  const [expanded, setExpanded] = useState(groupIds)

  const handleChange = (groupId: string) => {
    const idx = expanded.indexOf(groupId)
    if (idx !== -1) {
      setExpanded(expanded.filter(x => x !== groupId))
    } else {
      setExpanded(expanded.concat(groupId))
    }
  }

  // const setBudgetedById = (id, v) => {
  //   console.log(`Trying to set budgeted of ${id} to ${v}`)
  // }

  // const setCategoryNameById = (id, v) => {
  //   console.log(`Trying to set categoryName of ${id} to ${v}`)
  // }
  return (
    <>
    {
        groupIds.map((groupId: string) => {
          const categoriesOfGroup = categories.filter(x => x.groupId === groupId)
          const categoryGroup = {
            id: groupId,
            groupId: groupId,
            name: 'Test group name',
            spent: categoriesOfGroup.reduce((prev, curr) => prev + curr.spent, 0),
            balance: categoriesOfGroup.reduce((prev, curr) => prev + curr.balance, 0),
            budgeted: categoriesOfGroup.reduce((prev, curr) => prev + curr.budgeted, 0)
          }
          return <BudgetCategories
            key={categoryGroup.id}
            categoryGroup={categoryGroup}
            categories={categoriesOfGroup}
            setBudgetedById={(a, b) => null}
            setCategoryNameById={(a, b) => null}
            expanded={expanded.indexOf(categoryGroup.id) !== -1}
            handleChange={() => {
              handleChange(categoryGroup.id)
            }}
          />
        })
    }
    </>
  )
}

export default BudgetViewer
