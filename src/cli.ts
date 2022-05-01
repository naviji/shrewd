import BudgetApplication from './classes/BudgetApplication'
import Account from './models/Account'
/*

TODO
https://github.com/cronvel/terminal-kit
*. Whenever you make transactions on offbudget account, don't create transfers.
2. Get Targets working correctly
4. Read cleared and reconciled status from import
5. Support weekly targets
6. Complete synchronizer tests
7. Find a way to remove duplicate logic from the commands and add functions
*/

const app = new BudgetApplication()

/*
    // COMMAND HELP SECTION //
    * removeCategory() and removeCategoryGroup() and removeTransaction()
    *. addTarget()
    -2. importFromRegister() and importFromBudget()
    -1. undo() and redo()
    0. selectPreviousMonth() and selectNextMonth()
    1. addAccount()
        const axis = app.addAccount({ type: Account.TYPE_SAVINGS, name: "Axis", amount: 1000 })
    2. addCategoryGroup()
        const wishList = app.addCategoryGroup({ name: "Wishlist" })
    3. addCategory()
        let ferrari = app.addCategory({ parentId: wishList.id, name: "Ferrari" })
    4. assignMoney()
        app.assignMoney({ to: ferrari.id, amount: 250 })
    5. moveMoney()
        app.moveMoney({ from: ferrari.id, to: bmw.id, amount: 100})
    6. addTransaction()
        let gift = app.addTransaction({
            createdDay: [TIME], // currently needs to be specified in unixMs (change to dmy?)
            payee: "Raju",
            categoryId: ferrari.id,
            accountId: axis.id,
            memo: "Gift from Raju",
            outflow: 0,
            inflow: 1000,
            cleared: true
        })
*/

const options = {
  debugMode: true,
  saveChanges: false,
  loadData: false
}

app.start(options)

app.importFromRegister('./data/Register.csv')
app.importFromBudget('./data/Budget.csv')

const indexFund = Account.findByName('Index Funds')
app.convertToOffBudgetAccount(indexFund.id)

// const airpods = Category.findByName('AirPods Pro')

// Save x by date y already have available (with repeats)
// app.addTarget({categoryId: airpods.id, amount: 1000, date: '11/12/2021'})

// app.selectPreviousMonth()
// const indexFund = Account.getByAttrWithValue('name', 'Index Funds')[0]
// console.log('Fund is ', indexFund)
// console.log('Id is ', indexFund.id)
// app.convertToOffBudgetAccount(indexFund.id)

app.render()
