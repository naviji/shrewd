import BudgetApplication from './classes/BudgetApplication.js'

const app = new BudgetApplication()

const options = {
    debugMode: false
}

app.start(options)
const axis = app.addAccount({type: "Savings", name: "Axis", amount: 1000})
const sbi = app.addAccount({type: "Savings", name: "SBI", amount: 2000})

const wishList = app.addCategoryGroup({name: "Wishlist"})

app.render()

app.undo()

app.render()

app.redo()

app.render()
// let ferrari = app.addCategory({parentId: wishList.id, name: "Ferrari", amount: 0})
// let bmw = app.addCategory({parentId: wishList.id, name: "BMW", amount: 0})
// ferrari = app.assignMoney({id: ferrari.id, amount: 250})
// bmw = app.assignMoney({id: bmw.id, amount: 500})

// const essentials = app.addCategoryGroup({name: "Essentials"})
// let electricity = app.addCategory({parentId: essentials.id, name: "Electricity", amount: 250})
// let internet = app.addCategory({parentId: essentials.id, name: "Internet", amount: 1000})

// app.render()

/// BUDGET
/*
MoneyReadyToBeAssigned = SUM account balances - SUM assigned to categories.


*/