import BaseModel from "../models/BaseModel.js"
import Database from "../utils/Database.js"
import CommandService from "../services/CommandService.js"

class BudgetApplication {

    constructor () {
        this.commands = ['AddAccount', 'AddCategory', 'AddCategoryGroup']
    }

    start () {
        console.log("Starting budget application")
        BaseModel.setDb(new Database())
        this.registerCommands()
    }

    addAccount (toSave) {
        CommandService.instance().execute('AddAccount', toSave)
    }

    addCategoryGroup () {
        CommandService.instance().execute('AddCategoryGroup')
    }

    addCategory () {
        CommandService.instance().execute('AddCategory')
    }

    registerCommands () {
        for (let command of this.commands) {
            CommandService.instance().register(command)
        }
    }
}

export default BudgetApplication