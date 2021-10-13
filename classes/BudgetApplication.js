import BaseModel from "../models/BaseModel.js"
import Database from "../utils/Database.js"
import CommandService from "../services/CommandService.js"

class BudgetApplication {

    constructor() {
        this.commands = ['AddAccount', 'AddCategory', 'AddCategoryGroup']
    }

    start() {
        console.log("Starting budget application", new Database())
        BaseModel.setDb(new Database())
        this.registerCommands()
    }

    addAccount(account) {
        CommandService.instance().execute('AddAccount', account)
    }

    addCategoryGroup(group) {
        CommandService.instance().execute('AddCategoryGroup', group)
    }

    addCategory(category) {
        CommandService.instance().execute('AddCategory', category)
    }

    undo() {
        CommandService.instance().unexecute()
    }

    registerCommands() {
        for (let command of this.commands) {
            CommandService.instance().register(command)
        }
    }
}

export default BudgetApplication