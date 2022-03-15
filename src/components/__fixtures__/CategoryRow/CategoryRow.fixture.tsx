import React from 'react'
import CategoryRow from '../../CategoryRow'
import { useValue } from 'react-cosmos/fixture'

/* eslint react-hooks/rules-of-hooks: "off" */

// longName: <CategoryRow data={longNameProps}/>,
// largeAmounts: <CategoryRow data={largeAmountProps}/>,
// hugeAmountProps: <CategoryRow data={hugeAmountProps}/>,
// hugeAmountWithLongNameProps: <CategoryRow data={hugeAmountWithLongNameProps}/>

export default {
  default: () => {
    // name, budgeted, spent, balance, saveBudgetedAmount
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 12345600 })
    return (<CategoryRow
      name={'True expenses'}
      spent={12345600}
      balance={12345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v) => setBudgeted(v)}/>
    )
  }
}
