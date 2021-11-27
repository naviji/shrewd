import BudgetApplication from './classes/BudgetApplication'
import timeUtils, { unixMsFromDate, timeInUnixMs } from "./utils/timeUtils"


const app = new BudgetApplication()

const options = {
    debugMode: false
}

app.start(options)

app.importFromRegister('/Users/fc19503/Projects/personal/bff/data/Register.csv')
app.importFromBudget('/Users/fc19503/Projects/personal/bff/data/Budget.csv')


app.render()

/*
07/10/2021 | Index Funds  | Starting Balance | Inflow: Ready to Assign | -- | 0 | 24000 | true
09/10/2021 | Index Funds  | Manual Balance Adjustment | Money Tree: -- |  | 24000 | 0 | true
09/10/2021 | Index Funds  | Starting Balance | Money Tree: -- |  | 0 | 229255 | true

Manual balance adjustment transactions (from money tree) should also create the transfers
to ready to assing; amount = inflwo + outflow; (Since balance adjustments can be negative)


For moving to tracking account from saving; remove the transfers but keep the transactions
Keep a referring transaction id in the transfer? So that you can know what to delete?

Considered as inflow to ready to assign even though it is a tracking account.
Problem is we don't know it's a tracking account
*/

// const axis = app.addAccount({ type: "Savings", name: "Axis", amount: 1000 })
// const sbi = app.addAccount({ type: "Savings", name: "SBI", amount: 2000 })
// // const creditCard = app.addAccount({ type: "CreditCard", name: "MyCreditCard", amount: 1000})

// const wishList = app.addCategoryGroup({ name: "Wishlist" })
// let ferrari = app.addCategory({ parentId: wishList.id, name: "Ferrari" })
// let bmw = app.addCategory({ parentId: wishList.id, name: "BMW" })
// let benz = app.addCategory({ parentId: wishList.id, name: "Benz" })



// app.assignMoney({ to: ferrari.id, amount: 250 })
// app.assignMoney({ to: bmw.id, amount: 400 })
// app.assignMoney({ to: benz.id, amount: 2250 })
// app.moveMoney({ from: ferrari.id, to: bmw.id, amount: 100})

// // app.render()


// let giftFromRaju = app.addTransaction({
//     createdDay: timeUtils.timeInUnixMs(),
//     payee: "Raju",
//     categoryId: ferrari.id,
//     accountId: axis.id,
//     memo: "Gift from Raju",
//     outflow: 0,
//     inflow: 1000,
//     cleared: true
// })

// let giftToRaju = app.addTransaction({
//     createdDay: timeUtils.timeInUnixMs(),
//     payee: "Raju", 
//     categoryId: ferrari.id,
//     accountId: axis.id,
//     memo: "Gift to Raju",
//     outflow: 500,
//     inflow: 0,
//     cleared: true
// })



// app.render()