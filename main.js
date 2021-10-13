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
