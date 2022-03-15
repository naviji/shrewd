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
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 12345600 })
    return (<CategoryRow
      name={'True expenses'}
      spent={12345600}
      balance={12345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v) => setBudgeted(v)}
      isGroup={false} />
    )
  },
  longName: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 12345600 })
    return (<CategoryRow
      name={'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf'}
      spent={12345600}
      balance={12345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v) => setBudgeted(v)}
      isGroup={false} />
    )
  },
  hugeAmount: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 123412345600 })
    return (<CategoryRow
      name={'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf'}
      spent={123412345600}
      balance={123412345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v) => setBudgeted(v)}
      isGroup={false} />
    )
  },
  groupRow: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 123412345600 })
    return (<CategoryRow
      name={'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf'}
      spent={123412345600}
      balance={123412345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v) => setBudgeted(v)}
      isGroup={true} />
    )
  }
}
