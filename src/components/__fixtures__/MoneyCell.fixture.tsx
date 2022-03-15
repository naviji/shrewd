import React from 'react'
import MoneyCell from '../MoneyCell'
import { useValue } from 'react-cosmos/fixture'

/* eslint react-hooks/rules-of-hooks: "off" */

export default {
  default: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: 10000 })
    return <MoneyCell colored={false} editable={false} amount={amount} saveChangedAmount={setAmount}/>
  },
  editable: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: 20000 })
    return <MoneyCell colored={false} editable={true} amount={amount} saveChangedAmount={setAmount}/>
  },
  coloredPositive: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: 30000 })
    return <MoneyCell colored={true} editable={false} amount={amount} saveChangedAmount={setAmount}/>
  },
  coloredNegative: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: -30000 })
    return <MoneyCell colored={true} editable={false} amount={amount} saveChangedAmount={setAmount}/>
  },
  coloredHugeAmount: () => {
    const [amount, setAmount] = useValue('amount', { defaultValue: 123412345600 })
    return <MoneyCell colored={true} editable={false} amount={amount} saveChangedAmount={setAmount}/>
  }
}
