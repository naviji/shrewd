import { ModelType } from '../models/BaseModel'
import { AccountType } from '../models/Account'

export interface BaseItemEntity {
  id: string;
  updatedAt: number;
  createdAt: number;
}

export interface AccountEntity {
    id: string
    name: string,
    amount: number,
    type: AccountType
    createdAt: number
    updatedAt: number
    closed: boolean
    type_: ModelType
}

export interface CategoryEntity {
    id: string
    parentId: string
    name: string
    createdAt: number
    updatedAt: number
    type_: ModelType
}

export interface CategoryGroupEntity {
    id: string
    name: string
    createdAt: number
    updatedAt: number
    type_: ModelType
}

export interface TargetEntity {
    id: string
    name: string
    createdAt: number
    updatedAt: number
    amount: number
    categoryId: string
    endDate: number
    frequency: number
    type_: ModelType
}

export interface TransactionEntity {
    id: string
    createdDay: number
    payee: string
    categoryId: string
    accountId: string
    memo: string
    outflow: number
    inflow: number
    cleared: boolean
    createdAt: number
    updatedAt: number
    type_: ModelType
}

export interface TransferEntity {
    id: string
    from: string
    to: string
    amount: number
    createdAt: number
    updatedAt: number
    createdMonth: number
    accountId: string
    type_: ModelType
}

export interface DeletedItemEntity {
    id: string
    updatedAt: number;
    createdAt: number;
}

export interface SettingEntity {
    id: string
    updatedAt: number;
    createdAt: number;
}

export interface SyncedItemEntity {
    id: string
    updatedAt: number;
    createdAt: number;
}

export interface CategoryInfo {
    id: string,
    groupId:string,
    name: string,
    spent: number,
    balance: number,
    budgeted: number
}

export interface CategoryGroupInfo {
    id: string,
    name: string
}

export interface MonthInfo {
    name: string,
    amount: number
}
