import React, { useState } from 'react'
import BudgetCategories from './BudgetCategories'
import { CategoryGroupInfo, CategoryInfo } from '../types/Model'

const BudgetViewer = (
  { categories, categoryGroups, setBudgetedById, setCategoryNameById }:
  { categories: CategoryInfo[],
    categoryGroups: CategoryGroupInfo[]
    setBudgetedById: (id: string, value: number) => void,
    setCategoryNameById : (id: string, value: number) => void
  }) => {
  const groupIds = categoryGroups.map(x => x.id)
  const [expanded, setExpanded] = useState(groupIds)

  const handleChange = (groupId: string) => {
    const idx = expanded.indexOf(groupId)
    if (idx !== -1) {
      setExpanded(expanded.filter(x => x !== groupId))
    } else {
      setExpanded(expanded.concat(groupId))
    }
  }

  return (
    <>
    {
        categoryGroups.map((categoryGroup: any) => {
          const { name, id } = categoryGroup
          const categoriesOfGroup = categories.filter(x => x.groupId === id)
          const categoryGroupToRender = {
            id: id,
            groupId: id,
            name: name,
            spent: categoriesOfGroup.reduce((prev, curr) => prev + curr.spent, 0),
            balance: categoriesOfGroup.reduce((prev, curr) => prev + curr.balance, 0),
            budgeted: categoriesOfGroup.reduce((prev, curr) => prev + curr.budgeted, 0)
          }
          return <BudgetCategories
            key={categoryGroupToRender.id}
            categoryGroup={categoryGroupToRender}
            categories={categoriesOfGroup}
            setBudgetedById={setBudgetedById}
            setCategoryNameById={setCategoryNameById}
            expanded={expanded.indexOf(categoryGroupToRender.id) !== -1}
            handleChange={() => {
              handleChange(categoryGroupToRender.id)
            }}
          />
        })
    }
    </>
  )
}

export default BudgetViewer
