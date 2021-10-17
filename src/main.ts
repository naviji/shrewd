import BudgetApplication from './classes/BudgetApplication.js'
import Logger from './utils/Logger.js'
import { unixMsFromDate, todayInUnixMs } from "./utils/timeUtils.js"


const app = new BudgetApplication()

const options = {
    debugMode: false
}

app.start(options)

const axis = app.addAccount({ type: "Savings", name: "Axis", amount: 1000 })
const sbi = app.addAccount({ type: "Savings", name: "SBI", amount: 2000 })
// const creditCard = app.addAccount({ type: "CreditCard", name: "MyCreditCard", amount: 1000})

const wishList = app.addCategoryGroup({ name: "Wishlist" })
let ferrari = app.addCategory({ parentId: wishList.id, name: "Ferrari" })
let bmw = app.addCategory({ parentId: wishList.id, name: "BMW" })
let benz = app.addCategory({ parentId: wishList.id, name: "Benz" })

app.assignMoney({ categoryId: ferrari.id, amount: 250 })
app.assignMoney({ categoryId: bmw.id, amount: 400 })
app.assignMoney({ categoryId: benz.id, amount: 2250 })
// app.moveMoney({ from: ferrari.id, to: bmw.id, amount: 400})

let giftFromRaju = app.addTransaction({
    date: unixMsFromDate('October 13, 2021'),
    payee: "Raju",
    categoryId: ferrari.id,
    accountId: axis.id,
    memo: "Gift from Raju",
    outflow: 0,
    inflow: 1000,
    cleared: true
})

app.render()
