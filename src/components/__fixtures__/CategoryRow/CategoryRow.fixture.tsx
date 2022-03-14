import React from 'react'
import CategoryRow from '../../CategoryRow'

const dataProps = {
  name: 'True Expenses',
  budgeted: '1,123,456.00',
  spent: '1,123,456.00',
  balance: '1,123,456.00'
}

const longNameProps = {
  ...dataProps,
  name: 'Abcdefghijklmnopqrstuvwxyz1234678'
}

const largeAmountProps = {
  ...dataProps,
  budgeted: '12,123,456.00',
  spent: '12,123,456.00',
  balance: '12,123,456.00'
}

const hugeAmountProps = {
  ...dataProps,
  budgeted: '123,123,456.00',
  spent: '123,123,456.00',
  balance: '123,123,456.00'
}

const hugeAmountWithLongNameProps = {
  ...hugeAmountProps,
  name: 'Abcdefghijklmnopqrstuvwxyz1234678'
}

export default {
  default: <CategoryRow data={dataProps}/>,
  longName: <CategoryRow data={longNameProps}/>,
  largeAmounts: <CategoryRow data={largeAmountProps}/>,
  hugeAmountProps: <CategoryRow data={hugeAmountProps}/>,
  hugeAmountWithLongNameProps: <CategoryRow data={hugeAmountWithLongNameProps}/>
}
