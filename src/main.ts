import BudgetApplication from './classes/BudgetApplication'
import Account from './models/Account'
import timeUtils, { unixMsFromDate, timeInUnixMs } from "./utils/timeUtils"


/*

TODO
https://github.com/cronvel/terminal-kit
0. Use joplin CLI and find out how to design a CLI interface
1. Add option to mark a savings account as tracking
    a) Keep transactions but remove associated transfers to readyToAssign
    b) Associate transfers with transactionId so that 
        acc1 -> moneyTree and moneyTree -> acc2 can be identified with the same 
        transactionId.
        This further means that we *DO* need to keep each transfer separate!!!
    c) Find all transactions with that account and remove the associated transfers.
2. Get Targets working correctly
3. Remove static date in readyToAssign render helper
4. Read cleared and reconciled status from import
*/

const app = new BudgetApplication()

/*
    // COMMAND HELP SECTION //
    * convertToBudgetAccount()
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
    loadData: true
}

app.start(options)

// app.importFromRegister('./data/Register.csv')
// app.importFromBudget('./data/Budget.csv')

// const indexFund = Account.getByAttrWithValue('name', 'Index Funds')[0]
// console.log('Fund is ', indexFund)
// console.log('Id is ', indexFund.id)
// app.convertToBudgetAccount(indexFund.id)

app.render()
