import { AccountType } from '../models/Account'

export namespace CommandParams {
  export interface AddAccount {
    type: AccountType,
    name: string,
    amount: number
  }

  export interface ConvertAccount {
    accountId: string
  }

  export interface AddCategoryGroup {
    name: string
  }

  export interface AddCategory {
    parentId: string,
    name: string
  }

  export interface RemoveCategory {
    id: string,
    newCategoryId: string,
    moveTransfers: boolean
  }

  export interface RemoveCategoryGroup {
    id: string,
    newCategoryId: string
  }

  export interface AssingMoney {
    to: string,
    amount: number
  }

  export interface AddTransaction {
    createdDay: Date,
    payee: string,
    categoryId: string,
    accountId: string,
    memo: string,
    outflow: number,
    inflow: number,
    cleared: boolean
  }

  export interface MoveMoney {
    from: string,
    to: string,
    amount: number
    createdMonth?: number
  }

  export interface AddTarget {
    categoryId: string,
    amount: number,
    date: string // '11/12/2021'
  }

}
