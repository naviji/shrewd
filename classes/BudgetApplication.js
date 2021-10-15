
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
import Target from "../models/Target.js"

// const appLogger = new Logger()
class BudgetApplication {

    start(options) {
        this.setLogger(new Logger(options.debugMode ? LogLevel.Debug : LogLevel.Info))
        this.setupDatabase()
        this.registerCommands()
        this.calendar_ = Calendar.instance()
    }

    printSelectedMonth() {
        return this.calendar().printMonth()
    }
    printSelectedYear() {
        return this.calendar().printYear()
    }

    getSelectedMonth() {
        return this.calendar().timeInUnixMs()
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

    removeCategory(o) {
        return CommandService.instance().execute('RemoveCategory', o)
    }

    assignMoney(o) {
        return CommandService.instance().execute('AddTransfer', o)
    }

    addTransaction(o) {
        return CommandService.instance().execute('AddTransaction', o)
    }

    moveMoney(o) {
        return CommandService.instance().execute('MoveMoney', o)
    }

    registerCommands() {
        CommandService.instance().registerAll()
    }

    addTarget(o) {
        return CommandService.instance().execute('AddTarget', o)
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
        const totalMoneyInAccounts = accounts.length ? accounts.map(x => Account.getBalance(x.id)).reduce((a, b) => a + b, 0) : 0
        const moneyAlreadyAssigned = transfers.length ? transfers.map(x => x.amount).reduce((a, b) => a + b, 0) : 0

        return totalMoneyInAccounts - moneyAlreadyAssigned
    }

    renderAccounts_() {
        this.logger().log("Accounts: ")
        const accounts = Account.getAll()
        for (let account of accounts) {
            // Add account init amount as a transaction
            this.logger().log(`   ${account.name} [${Account.getBalance(account.id)}]`)
        }
    }

    renderTargets_(categoryId) {
        const amountAssigned = Category.getAmountAssignedOfMonth(categoryId)
        const target = Target.getByCategoryId(categoryId)
        if (target && (target.date <= this.getSelectedMonth()))
            this.logger().log(`             --- Every ${target.every} ${target.type} ${target.amount} ( You need ${(target.amount /target.every) - (amountAssigned + Category.getAllActivity(categoryId))} this ${target.type})`)
    }

    renderCategories_() {
        this.logger().log("Category Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            const categories = Category.getByParentId(group.id)
            const totalMoneyAssigned = categories.length ? categories.map(x => Category.getAmountAssignedOfMonth(x.id)).reduce((a, b) => a + b, 0) : 0
            this.logger().log(`    ${group.name} [${totalMoneyAssigned}]`)
            for (let category of categories) {
                const amountAssigned = Category.getAmountAssignedOfMonth(category.id)
                const activityAmount = Category.getActivityOfMonth(category.id)
                const availableToSpend = amountAssigned + Category.getAllActivity(category.id)
                this.logger().log(`    --- ${category.name} [${amountAssigned}] [${activityAmount}] [${availableToSpend}]  `)
                this.logger().debug(category.index)
                this.renderTargets_(category.id)
            }
        }
    }

    renderTransactions_() {
        this.logger().log("Transactions:")
        const transactions = Transaction.getAll()
        for (let transaction of transactions) {
            this.logger().log(`${dateFromUnixMs(transaction.date)} | ${Account.getNameFromId(transaction.accountId)}  | ${transaction.payee} | ${Category.getNameFromId(transaction.categoryId)} | ${transaction.memo} | ${transaction.outflow} | ${transaction.inflow} | ${transaction.cleared}`)
        }
    }

    render() {
        const targets = Target.getAll()
        this.logger().log(`\n--- BUDGET APP ---`)
        this.logger().log(`Month: ${this.printSelectedMonth()}`)
        this.logger().log(`Year: ${this.printSelectedYear()}`)
        this.logger().log(`Ready to assign : ${this.readyToAssign()}`)

        this.renderAccounts_();
        this.renderCategories_();
        this.renderTransactions_();
        return this
    }


}

export default BudgetApplication