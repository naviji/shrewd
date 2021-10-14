import BudgetApplication from './classes/BudgetApplication.js'
import { timeInUnixMs } from "./utils/timeUtils.js"


const app = new BudgetApplication()

const options = {
    debugMode: false
}

app.start(options)

const axis = app.addAccount({type: "Savings", name: "Axis", amount: 1000})
const sbi = app.addAccount({type: "Savings", name: "SBI", amount: 2000})

const wishList = app.addCategoryGroup({name: "Wishlist"})
let ferrari = app.addCategory({parentId: wishList.id, name: "Ferrari"})
let bmw = app.addCategory({parentId: wishList.id, name: "BMW"})
let benz = app.addCategory({parentId: wishList.id, name: "Benz"})
app.assignMoney({categoryId: ferrari.id, amount: 250})
app.assignMoney({categoryId: bmw.id, amount: 500})
app.assignMoney({categoryId: benz.id, amount: 2250})


app.render().undo().redo().render()


// app.render().undo().render().undo().render().undo().render()
// app.undo()



// app.redo()
// app.render()

// const essentials = app.addCategoryGroup({name: "Essentials"})
// let electricity = app.addCategory({parentId: essentials.id, name: "Electricity"})
// let internet = app.addCategory({parentId: essentials.id, name: "Internet"})
// electricity = app.assignMoney({categoryId: electricity.id, amount: 100})
// internet = app.assignMoney({categoryId: internet.id, amount: 200})

// app.render()
// app.selectPreviousMonth()
// app.render()

// app.addTransaction({
//     date: timeInUnixMs('October 13, 2021'),
//     payee: "Raju",
//     categoryId: ferrari.id,
//     accountId: axis.id,
//     memo: "Gift from Raju",
//     outflow: 0,
//     inflow: 100,
//     cleared: true})

// app.addTransaction({
//     date: timeInUnixMs('October 11, 2021'),
//     payee: "Ananthu",
//     categoryId: bmw.id,
//     accountId: sbi.id,
//     memo: "Loan to Ananthu",
//     outflow: 100,
//     inflow: 0,
//     cleared: true})

// app.render()

// app.render()

// app.selectNextMonth()

// app.assignMoney({categoryId: ferrari.id, amount: 1000})
// app.assignMoney({categoryId: bmw.id, amount: 200})

// app.render()

// // app.selectPreviousMonth()

// app.render()
// app.selectPreviousMonth()
// app.render()
    // .undo()
    // .render()
    // .redo()
    // .render()

/*
TO DO:
0. Distinguish transfers and transactions
1. app.addTransaction({date: DATE, payee: STRING, categoryId: ID, memo: STRING, outflow: NUM, inflow: NUM, cleared: BOOL})
2. app.moveMoney{{fromId: ID, toId: ID}} // From a category to another category
3. Logic to delete a category or categoryGroup
    When deleting a category with atleast a single transaction, 
    (Or a categoryGroup containing such a category)
    we need to provide another category as replacement which will get all the transactions 
    and assinged amount of the deleted group
4. Change assignMoney logic to consider the month in which it is assigned
    Each category has a distinct asssign for each month
    Assigning money should be considered just like transactions and stored in db

*/
