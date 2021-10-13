
import Database from "../utils/Database.js"
import Logger from "../utils/Logger.js"
import CommandService from "../services/CommandService.js"
import Account from "../models/Account.js"
import CategoryGroup from "../models/CategoryGroup.js"
import Category from "../models/Category.js"
import BaseModel from "../models/BaseModel.js"

// const appLogger = new Logger()
class BudgetApplication {

    constructor() {
        this.commands = ['AddAccount', 'AddCategory', 'AddCategoryGroup']
    }

    start() {
        this.setLogger(new Logger())
        this.setupDatabase()
        this.registerCommands()
        
        this.logger().log("TESTING")
    }

    setupDatabase() {
        BaseModel.setDb(new Database(this.logger()))
    }

    logger() {
        return this.logger_;
    }

    setLogger(logger) {
        this.logger_ = logger
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

    get readyToAssign() {
        const categories = Category.getAll()
        const accounts = Account.getAll()

        const totalMoneyInAccounts = accounts.reduce((a, b) => a.amount + b.amount)
        const moneyAlreadyAssigned = categories.reduce((a, b) => a.amount + b.amount)

        return totalMoneyInAccounts - moneyAlreadyAssigned
    }

    render () {
        this.logger().debug(`--- BUDGET APP ---`)
        this.logger().debug("Ready to assign : ", this.readyToAssign)
        this.logger().debug("Accounts: ")
        const accounts = Account.getAll()
        for (let account of accounts) {
            this.logger().debug(`   ${account.name} [${account.amount}]`)
        }

        this.logger().debug("Categories Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            this.logger().debug(`    ${group.name} []`)
            const categories = Category.getAll()
            for (let category of categories) {
                this.logger().debug(`    --- ${category.name} [${category.amount}]`)
            }
        }
    }

    registerCommands() {
        for (let command of this.commands) {
            CommandService.instance().register(command)
        }
    }
}

export default BudgetApplication