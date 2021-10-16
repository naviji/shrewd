
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
        return CommandService.instance().execute('AddAccount', Object.assign(o, { date : this.getSelectedMonth()}))
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
        const { categoryId } = o
        // null refers to ready to assign category
        this.moveMoney(Object.assign(o, { from : null, to: categoryId, categoryId: undefined}))
    }

    addTransaction(o) {
        return CommandService.instance().execute('AddTransaction', o)
    }

    removeTransaction(o) {
        return CommandService.instance().execute('RemoveTransaction', o)
    }

    moveMoney(o) {

        return CommandService.instance().execute('MoveMoney', Object.assign(o, { date : this.getSelectedMonth()} ))
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

    firstTransferToReadyToAssign() {
        // const INFINITY
        let transferDates =  Transfer.getAll().filter(x => x.categoryId === null).map(x => x.date)
        // transferDates.push(100000000000000)
        // this.logger().debug(transferDates)
        transferDates.sort((a, b)=>a-b)
        // this.logger().debug(transferDates)
        return transferDates.length ? transferDates[0] : Infinity
    }

    readyToAssign() {
        // Category id with null indicates the Ready to Assign category
        if (this.firstTransferToReadyToAssign() > this.getSelectedMonth()) return 0
        return Category.getAllAssigned(null)
    }



    assignedThisMonth(categoryId) {
        const month = this.getSelectedMonth()
        return Category.getAssignedOfMonth(categoryId, month)
    }

    leftOverFromLastMonth(categoryId) {
        const month = this.getSelectedMonth()
        // const prevMonth = timeUtils.subtractMonth(month)
        return this.activityTillMonth(categoryId, month) + this.assignedTillMonth(categoryId, month)
    }

    activityTillMonth(categoryId, month) {
        return Category.activityTillMonth(categoryId, month)
    }

    assignedTillMonth(categoryId, month) {
        return Category.assignedTillMonth(categoryId, month)
    }


    activityThisMonth(categoryId) {
        const month = this.getSelectedMonth()
        return Category.getActivityOfMonth(categoryId, month)
    }

    renderCategories_() {
        this.logger().log("Category Groups:")
        const groups = CategoryGroup.getAll()
        for (let group of groups) {
            const categories = Category.getByParentId(group.id)

            let totalAssignedThisMonth = 0;
            let totalActivityThisMonth = 0;
            let totalAvailableThisMonth = 0;

            for (let category of categories) {
                category.assignedThisMonth = this.assignedThisMonth(category.id)
                category.activityThisMonth =  this.activityThisMonth(category.id)
                // category.activityTillThisMonth = this.activityTillMonth(category.id) 
                category.availableThisMonth = category.assignedThisMonth + category.activityThisMonth + this.leftOverFromLastMonth(category.id)
                totalAssignedThisMonth += category.assignedThisMonth
                totalActivityThisMonth += category.activityThisMonth
                totalAvailableThisMonth += category.availableThisMonth
            }

            this.logger().log(`    ${group.name} [${totalAssignedThisMonth}] [${totalActivityThisMonth}] [${totalAvailableThisMonth}]`)
            for (let category of categories) {
                this.logger().log(`    --- ${category.name} [${category.assignedThisMonth}] [${category.activityThisMonth}] [${category.availableThisMonth}]  `)
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