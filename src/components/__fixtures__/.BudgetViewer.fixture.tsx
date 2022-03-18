import React from 'react'
import BudgetViewer from '../BudgetViewer'
import { useValue } from 'react-cosmos/fixture'
import { nanoid } from 'nanoid'

/* eslint react-hooks/rules-of-hooks: "off" */

// key={x.id}
// name={x.name}
// spent={x.spent}
// balance={x.balance}
// budgeted={x.budgeted}
// saveBudgetedAmount={(v) => setBudgetedById(x.id, v)}
// saveCategoryName={(v) => setCategoryNameById(x.id, v)}
// isGroup={false} />

const categories = [
  {}
]

export default {
  default: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: 10000 })
    return <BudgetViewer
                categories={categories}
                setBudgetedById={setBudgetedById}
                setCategoryNameById={setCategoryNameById} />
  }
}
