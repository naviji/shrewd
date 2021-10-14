
import Database from "../utils/Database.js"
import Logger, { LogLevel } from "../utils/Logger.js"
import CommandService from "../services/CommandService.js"
import Account from "../models/Account.js"
import Transfer from "../models/Transfer.js"
import Transaction from "../models/Transaction.js"
import CategoryGroup from "../models/CategoryGroup.js"
import Category from "../models/Category.js"
import BaseModel from "../models/BaseModel.js"
import Calendar from "../utils/Calendar.js"
import { dateFromUnixMs } from '../utils/timeUtils.js'

// const appLogger = new Logger()
class BudgetApplication {

    start(options) {
        this.setLogger(new Logger(options.debugMode ? LogLevel.Debug : LogLevel.Info))
        this.setupDatabase()
        this.registerCommands()
        this.calendar_ = Calendar.instance()
    }

    getSelectedMonth() {
        return this.calendar().printMonth()
    }

    selectNextMonth() {
        return this.calendar().selectNextMonth()
    }

    selectPreviousMonth() {
        return this.calendar().selectPreviousMonth()
    }

    calendar() {
        return this.calendar_
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

    addTransaction(o) {
        return CommandService.instance().execute('AddTransaction', o)
    }

    registerCommands() {
        CommandService.instance().registerAll()
    }

    undo() {
        CommandService.instance().undo()
        return this
    }

    redo() {
        CommandService.instance().redo()
        return this
    }

    readyToAssign() {
        const transfers = Transfer.getAll()
        const accounts = Account.getAll()
        const totalMoneyInAccounts = accounts.length ? accounts.map(x => Account.getBalance(x.id)).reduce((a, b) => a+b, 0) : 0
        const moneyAlreadyAssigned = transfers.length ? transfers.map(x => x.amount).reduce((a, b) => a+b, 0) : 0

        return totalMoneyInAccounts - moneyAlreadyAssigned
    }

    render () {
        this.logger().log(`\n--- BUDGET APP ---`)
        this.logger().log(`Month: ${this.getSelectedMonth()}`)
        this.logger().log(`Ready to assign : ${this.readyToAssign()}`)
        this.logger().log("Accounts: ")
        const accounts = Account.getAll()
        for (let account of accounts) {
            // Add account init amount as a transaction
            this.logger().log(`   ${account.name} [${Account.getBalance(account.id)}]`)
        }

        this.logger().log("Category Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            const categories = Category.getByParentId({parentId : group.id})
            const totalMoneyAssigned = categories.length ? categories.map(x => Category.getAmountAssigned(x.id)).reduce((a, b) => a + b, 0) : 0
            this.logger().log(`    ${group.name} [${totalMoneyAssigned}]`)
            for (let category of categories) {
                const amountAssigned = Category.getAmountAssigned(category.id)
                const activityAmount = Category.getActivity(category.id)
                const availableToSpend = amountAssigned + activityAmount
                this.logger().log(`    --- ${category.name} [${amountAssigned}] [${activityAmount}] [${availableToSpend}]`)
            }
        }

        this.logger().log("Transactions:")
        const transactions = Transaction.getAll()
        for (let transaction of transactions) {
            this.logger().log(`${dateFromUnixMs(transaction.date)} | ${Account.getNameFromId(transaction.accountId)}  | ${transaction.payee} | ${Category.getNameFromId(transaction.categoryId)} | ${transaction.memo} | ${transaction.outflow} | ${transaction.inflow} | ${transaction.cleared}`)
        }
        return this
    }


}

export default BudgetApplication