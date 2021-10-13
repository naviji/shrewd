import BaseModel from "../models/BaseModel.js"
import Database from "../utils/Database.js"
import CommandService from "../services/CommandService.js"
import Account from "../models/Account.js"

class BudgetApplication {

    constructor() {
        this.commands = ['AddAccount', 'AddCategory', 'AddCategoryGroup']
    }

    start() {
        BaseModel.setDb(new Database())
        this.registerCommands()
    }

    addAccount(o) {
        return CommandService.instance().execute('AddAccount', o)
    }

    addCategoryGroup(o) {
        return CommandService.instance().execute('AddCategoryGroup', o)
    }

    addCategory(o) {
        return CommandService.instance().execute('AddCategory', o)
    }

    render () {
        console.log(`--- BUDGET APP ---`)
        console.log("Accounts: ")
        const accounts = Account.getAll()
        for (let account of accounts) {
            console.log(`Account name: ${account.name} [${account.amount}]`)
        }
    }

    undo() {
        return CommandService.instance().unexecute()
    }

    registerCommands() {
        for (let command of this.commands) {
            CommandService.instance().register(command)
        }
    }
}

export default BudgetApplication