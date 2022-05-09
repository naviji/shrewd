import React from 'react'
import CategoryRow from '../CategoryRow'
import { useValue } from 'react-cosmos/fixture'

/* eslint react-hooks/rules-of-hooks: "off" */

export default {
  default: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 12345600 })
    const [categoryName, setCategoryName] = useValue('categoryName', { defaultValue: 'Test' })
    return (<CategoryRow
      name={categoryName}
      spent={12345600}
      balance={12345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v: any) => setBudgeted(v)}
      saveCategoryName={(v: any) => setCategoryName(v)}
      isGroup={false}
      handleChange={() => {}}
      expanded={false}/>
    )
  },
  longName: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 12345600 })
    const [categoryName, setCategoryName] = useValue('categoryName', { defaultValue: 'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf' })
    return (<CategoryRow
      name={categoryName}
      spent={12345600}
      balance={12345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v: any) => setBudgeted(v)}
      saveCategoryName={(v: any) => setCategoryName(v)}
      isGroup={false}
      handleChange={() => {}}
      expanded={false}/>
    )
  },
  hugeAmount: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 123412345600 })
    const [categoryName, setCategoryName] = useValue('categoryName', { defaultValue: 'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf' })
    return (<CategoryRow
      name={categoryName}
      spent={123412345600}
      balance={123412345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v: any) => setBudgeted(v)}
      saveCategoryName={(v: any) => setCategoryName(v)}
      isGroup={false}
      handleChange={() => {}}
      expanded={false}/>

    )
  },
  groupRow: () => {
    const [budgeted, setBudgeted] = useValue('budgeted', { defaultValue: 123412345600 })
    const [categoryName, setCategoryName] = useValue('categoryName', { defaultValue: 'sklfjldksjflkdsjfldksjflsdkfjskdjfldskjfldksjf' })
    return (<CategoryRow
      name={categoryName}
      spent={123412345600}
      balance={123412345600}
      budgeted={budgeted}
      saveBudgetedAmount={(v: any) => setBudgeted(v)}
      saveCategoryName={(v: any) => setCategoryName(v)}
      isGroup={true}
      handleChange={() => {}}
      expanded={false}/>
    )
  }
}
