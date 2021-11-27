
import Database from "../lib/Database"
import Logger, { LogLevel } from "../lib/Logger"
import CommandService from "../services/CommandService"
import Account from "../models/Account"
import Transfer from "../models/Transfer"
import Transaction from "../models/Transaction"
import CategoryGroup from "../models/CategoryGroup"
import Category from "../models/Category"
import BaseModel from "../models/BaseModel"
import Calendar from "../lib/Calendar"
import { dateFromUnixMs } from '../utils/timeUtils'
import Target from "../models/Target"
import timeUtils from "../utils/timeUtils"
import Setting from "../models/Setting"
import ImportService from "../services/ImportService"

// const appLogger = new Logger()
class BudgetApplication {

    private calendar_
    private logger_

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
        const { to, amount } = o
        this.moveMoney({from : Setting.get('readyToAssignId'), to, amount })
    }

    addTransaction(o) {
        return CommandService.instance().execute('AddTransaction', o)
    }

    removeTransaction(o) {
        return CommandService.instance().execute('RemoveTransaction', o)
    }

    moveMoney(o) {
        return CommandService.instance().execute('AddTransfer', o)
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

    importFromRegister(path) {
        ImportService.instance().importFromRegister(path)
    }

    importFromBudget(path) {
        ImportService.instance().importFromBudget(path)
    }

    firstTransferToReadyToAssign() {
        // const INFINITY
        let transferDates =  Transfer.getAll().filter(x => x.to === Setting.get('readyToAssignId')).map(x => x.createdMonth)
        // transferDates.push(100000000000000)
        // this.logger().debug(transferDates)
        transferDates.sort((a, b)=>a-b)
        // this.logger().debug(transferDates)
        return transferDates.length ? transferDates[0] : Infinity
    }

    readyToAssign() {
        // Category id with null indicates the Ready to Assign category
        // Change this condition to use the date in which account gets created instead?
        // if (this.firstTransferToReadyToAssign() > this.getSelectedMonth()) return 0
        return Category.getAllAssigned(Setting.get('readyToAssignId'))
    }



    assignedThisMonth(categoryId) {
        const month = this.getSelectedMonth()
        return Category.getAllAssignedThisMonth(categoryId, month)
    }

    availableThisMonth(categoryId) {
        const lastTrasferMonth = timeUtils.unixMsFromMonth('Sep 2021')

        const _availableOnMonth = (categoryId, month) => {
            if (month < lastTrasferMonth) return 0
            const prevMonth = timeUtils.subtractMonth(month)
            return Category.getAllAssignedThisMonth(categoryId, month) +
                   Category.getActivityOfMonth(categoryId, month) +
                   _availableOnMonth(categoryId, prevMonth)
        }

        const month = this.getSelectedMonth()
        return _availableOnMonth(categoryId, month)
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
                category.availableThisMonth = this.availableThisMonth(category.id)

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

            this.logger().log(`${dateFromUnixMs(transaction.createdDay)} | ${Account.getNameFromId(transaction.accountId)}  | ${transaction.payee} | ${Category.getNameFromId(transaction.categoryId)} | ${transaction.memo} | ${transaction.outflow} | ${transaction.inflow} | ${transaction.cleared}`)
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
        if (target && (target.createdMonth <= this.getSelectedMonth()))
            this.logger().log(`             --- Every ${target.every} ${target.type} ${target.amount} ( You need ${(target.amount /target.every) - (assignedThisMonth + Category.getAllActivity(categoryId))} this ${target.type})`)
    }

    render() {
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