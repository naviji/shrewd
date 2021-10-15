import BudgetApplication from './classes/BudgetApplication.js'
import { timeInUnixMs, todayInUnixMs } from "./utils/timeUtils.js"


/*
TO DO:

1. Logic to delete/hide a category/categoryGroup/accounts/transactions
    When deleting a category with atleast a single transaction, 
    (Or a categoryGroup containing such a category)
    we need to provide another category as replacement which will get all the transactions 
    and assinged amount of the deleted category/group
2. Add credit card logic
3. Investment or Debt accounts
3. Add Goals (Monthly, Month/Year, By Date)
4. Reconciliation
5. Synchronization
6. Importing from YNAB
7. Importing and matching transactions from bank statement
8. Multiple budgets
9. End to End encryption
10. Reports
11. Scheduled transactions (how do we sync this?)
12. Smart auto populate of categories and payee when doing a transaction
13. Export to spreadsheet (Aspire?, option to filter transactions when exporting)
14. Mobile App (Notification icon doesn't go away if you have overspend)
15. Search
16. Change currency and date display format. 
17. Change locale?


Optional
1. Sharing
2. Password lock
3. Plugin system
4. Multiple language translations

*/



const app = new BudgetApplication()

const options = {
    debugMode: false
}

app.start(options)

const axis = app.addAccount({ type: "Savings", name: "Axis", amount: 1000 })
const sbi = app.addAccount({ type: "Savings", name: "SBI", amount: 2000 })

const wishList = app.addCategoryGroup({ name: "Wishlist" })
let ferrari = app.addCategory({ parentId: wishList.id, name: "Ferrari" })
let bmw = app.addCategory({ parentId: wishList.id, name: "BMW" })
let benz = app.addCategory({ parentId: wishList.id, name: "Benz" })

const fixedExpenses = app.addCategoryGroup({ name: "Fixed Expenses" })
let funMoney = app.addCategory({ parentId: fixedExpenses.id, name: "Fun Money"})
// app.render()
// app.removeCategory(ferrari.id)

app.assignMoney({ categoryId: ferrari.id, amount: 250 })
app.assignMoney({ categoryId: bmw.id, amount: 400 })
app.assignMoney({ categoryId: benz.id, amount: 2250 })

// app.moveMoney({ from: bmw.id, to: ferrari.id, amount: 250 })

app.addTransaction({
    date: timeInUnixMs('October 13, 2021'),
    payee: "Raju",
    categoryId: ferrari.id,
    accountId: axis.id,
    memo: "Gift from Raju",
    outflow: 0,
    inflow: 1000,
    cleared: true
})

let test = app.addCategory({ parentId: wishList.id, name: "test" })

app.assignMoney({ categoryId: test.id, amount: 100 })

app.render()

app.removeCategory({ id : ferrari.id, newCategoryId: test.id})
app.render()
app.undo()
app.render()
app.redo()
app.render()
// app.render()

// app.addTarget({
//     categoryId: ferrari.id,
//     amount: 1000,
//     type: "Month",
//     every: 2
// })

// app.render()

// app.selectNextMonth()


// app.addTransaction({
//     date: timeInUnixMs('November 13, 2021'),
//     payee: "Raju",
//     categoryId: ferrari.id,
//     accountId: axis.id,
//     memo: "Gift from Raju",
//     outflow: 0,
//     inflow: 2000,
//     cleared: true
// })
// app.render()

// app.selectPreviousMonth()
// app.render()
