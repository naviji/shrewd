import BudgetApplication from './classes/BudgetApplication.js'

const app = new BudgetApplication()

app.start()
const axis = app.addAccount({type: "Savings", name: "Axis", amount: 1000})
console.log(axis)

const wishList = app.addCategoryGroup({name: "Wishlist"})
console.log(wishList)
const ferrari = app.addCategory({parentId: wishList.id, name: "Ferrari"})
console.log(ferrari)
const bmw = app.addCategory({parentId: wishList.id, name: "BMW"})
console.log(bmw)


/// BUDGET
/*
MoneyReadyToBeAssigned = SUM account balances


*/