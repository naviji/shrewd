import React from 'react'
import { CategoryEntity } from '../types/model'

import CategoryRow from './CategoryRow'
import CssBaseline from '@mui/material/CssBaseline'

const BudgetCategories = ({
  categoryGroup,
  categories,
  setBudgetedById,
  setCategoryNameById,
  expanded,
  handleChange
}: any) => {
  return (
    <React.Fragment>
    <CssBaseline />

                <CategoryRow
                    key={categoryGroup.id}
                    name={categoryGroup.name}
                    spent={categoryGroup.spent}
                    balance={categoryGroup.balance}
                    budgeted={categoryGroup.budgeted}
                    saveBudgetedAmount={(v: number) => setBudgetedById(categoryGroup.id, v)}
                    saveCategoryName={(v: number) => setCategoryNameById(categoryGroup.id, v)}
                    isGroup={true}
                    handleChange={handleChange}
                    expanded={expanded} />
                {
                    expanded
                      ? categories.map((x) => <CategoryRow
                        key={x.id}
                        name={x.name}
                        spent={x.spent}
                        balance={x.balance}
                        budgeted={x.budgeted}
                        saveBudgetedAmount={(v: number) => setBudgetedById(categoryGroup.id, v)}
                        saveCategoryName={(v: number) => setCategoryNameById(categoryGroup.id, v) }
                        isGroup={false}
                        handleChange={() => null}
                        expanded={expanded}
                        />)
                      : null
                }
    </React.Fragment>
  )
}

export default BudgetCategories
