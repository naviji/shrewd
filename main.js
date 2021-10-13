import BudgetApplication from './classes/BudgetApplication.js'

const app = new BudgetApplication()

app.start()
const axis = app.addAccount({type: "Savings", name: "Axis", amount: 1000})
const wishList = app.addCategoryGroup({name: "Wishlist"})
const ferrari = app.addCategory({parentId: wishList.id, name: "Ferrari"})
const bmw = app.addCategory({parentId: wishList.id, name: "BMW"})

app.render()

/// BUDGET
/*
MoneyReadyToBeAssigned = SUM account balances - SUM assigned to categories.


*/