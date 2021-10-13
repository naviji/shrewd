import BudgetApplication from './classes/BudgetApplication.js'

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
ferrari = app.assignMoney({id: ferrari.id, amount: 250})
bmw = app.assignMoney({id: bmw.id, amount: 500})

const essentials = app.addCategoryGroup({name: "Essentials"})
let electricity = app.addCategory({parentId: essentials.id, name: "Electricity", amount: 250})
let internet = app.addCategory({parentId: essentials.id, name: "Internet", amount: 1000})


app.render()
    .undo()
    .render()
    .redo()
    .render()

/*
TO DO:
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
