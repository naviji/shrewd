import BaseModel from "../models/BaseModel.js"
import Database from "../utils/Database.js"
import CommandService from "../services/CommandService.js"

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