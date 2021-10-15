
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
import timeUtils from "../utils/timeUtils.js"

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

    removeCategoryGroup(o) {
        return CommandService.instance().execute('RemoveCategoryGroup', o)
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
        const assignedThisMonth = this.assignedThisMonth(categoryId)
        const target = Target.getByCategoryId(categoryId)
        if (target && (target.date <= this.getSelectedMonth()))
            this.logger().log(`             --- Every ${target.every} ${target.type} ${target.amount} ( You need ${(target.amount /target.every) - (assignedThisMonth + Category.getAllActivity(categoryId))} this ${target.type})`)
    }

    assignedThisMonth_(categoryId, month) {
        return Category.getAssignedOfMonth(categoryId, month)
    }

    assignedThisMonth(categoryId) {
        const month = this.getSelectedMonth()
        return this.assignedThisMonth_(categoryId, month)
    }

    // leftOverFromLastMonth_(categoryId, month) {
    //     if (month < this.lastMonthWithTransactions()) return 0;
    //     const prevMonth = subtractMonth(month)
    //     const result = this.assignedThisMonth_(categoryId, month) + this.leftOverFromLastMonth_(categoryId, prevMonth)
    // }

    leftOverFromLastMonth(categoryId) {
        const month = this.getSelectedMonth()
        const prevMonth = timeUtils.subtractMonth(month)
        return this.activityTillMonth(categoryId, prevMonth) + this.assignedTillMonth(categoryId, prevMonth)
    }

    activityTillMonth(categoryId, month) {
        return Category.activityTillMonth(categoryId, month)
    }

    assignedTillMonth(categoryId, month) {
        return Category.assignedTillMonth(categoryId, month)
    }

    activityThisMonth_(categoryId, month) {
        return Category.getActivityOfMonth(categoryId, month)
    }

    activityThisMonth(categoryId) {
        const month = this.getSelectedMonth()
        return this.activityThisMonth_(categoryId, month)
    }

    renderCategories_() {
        this.logger().log("Category Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            const categories = Category.getByParentId(group.id)
            const totalMoneyAssigned = categories.length ? categories.map(x => this.assignedThisMonth(x.id)).reduce((a, b) => a + b, 0) : 0
            this.logger().log(`    ${group.name} [${totalMoneyAssigned}]`)
            for (let category of categories) {
                const assignedThisMonth = this.assignedThisMonth(category.id) // Category.getAmountAssignedOfMonth(category.id)
                const activityThisMonth = this.activityThisMonth(category.id) // Category.getActivityOfMonth(category.id)
                const availableToSpend = assignedThisMonth + activityThisMonth + this.leftOverFromLastMonth(category.id)  // Category.getAllActivity(category.id)
                this.logger().log(`    --- ${category.name} [${assignedThisMonth}] [${activityThisMonth}] [${availableToSpend}]  `)
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