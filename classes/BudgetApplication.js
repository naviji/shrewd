
import Database from "../utils/Database.js"
import Logger, { LogLevel } from "../utils/Logger.js"
import CommandService from "../services/CommandService.js"
import Account from "../models/Account.js"
import CategoryGroup from "../models/CategoryGroup.js"
import Category from "../models/Category.js"
import BaseModel from "../models/BaseModel.js"

// const appLogger = new Logger()
class BudgetApplication {

    constructor() {
        this.commands = ['AddAccount', 'AddCategory', 'AddCategoryGroup', 'AssignMoney']
    }

    start(options) {
        this.setLogger(new Logger(options.debugMode ? LogLevel.Debug : LogLevel.Info))
        this.setupDatabase()
        this.registerCommands()
        
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

    assignMoney(o) {
        return CommandService.instance().execute('AssignMoney', o)
    }

    get readyToAssign() {
        const categories = Category.getAll()
        const accounts = Account.getAll()

        const totalMoneyInAccounts = accounts.map(x => x.amount).reduce((a, b) => a + b)
        const moneyAlreadyAssigned = categories.map(x => x.amount).reduce((a, b) => a + b)

        return totalMoneyInAccounts - moneyAlreadyAssigned
    }

    render () {
        this.logger().log(`--- BUDGET APP ---`)
        this.logger().log(`Ready to assign : ${this.readyToAssign}`)
        this.logger().log("Accounts: ")
        const accounts = Account.getAll()
        for (let account of accounts) {
            this.logger().log(`   ${account.name} [${account.amount}]`)
        }

        this.logger().log("Category Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            const categories = Category.getByParentId({parentId : group.id})
            const totalMoneyAssigned = categories.reduce((a, b) => a.amount + b.amount)
            this.logger().log(`    ${group.name} [${totalMoneyAssigned}]`)
            for (let category of categories) {
                this.logger().log(`    --- ${category.name} [${category.amount}]`)
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