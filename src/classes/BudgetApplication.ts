
import Database from '../lib/Database'
import Logger, { LogLevel } from '../lib/Logger'
import CommandService from '../services/CommandService'
import Account from '../models/Account'
import Transfer from '../models/Transfer'
import Transaction from '../models/Transaction'
import CategoryGroup from '../models/CategoryGroup'
import Category from '../models/Category'
import BaseModel from '../models/BaseModel'
import Calendar from '../lib/Calendar'
import timeUtils, { dateFromUnixMs } from '../utils/timeUtils'
import Target from '../models/Target'
import Setting from '../models/Setting'
import ImportService from '../services/ImportService'
const sprintf = require('sprintf-js').sprintf

// const appLogger = new Logger()

function _rupee (amount) {
  return sprintf('%10.2f', amount / 100)
  return `Rs. ${amount / 100}`
}
class BudgetApplication {
    private calendar_ : Calendar = Calendar.instance()
    private logger_

    start (options) {
      this.setLogger(new Logger(options.debugMode ? LogLevel.Debug : LogLevel.Info))
      this.setupDatabase(options)
      this.registerCommands()
      this.calendar_ = Calendar.instance()
    }

    printSelectedMonth () {
      return this.calendar().printMonth()
    }

    printSelectedYear () {
      return this.calendar().printYear()
    }

    private getSelectedMonth () {
      return this.calendar().timeInUnixMs()
    }

    selectNextMonth () {
      return this.calendar().selectNextMonth()
    }

    selectPreviousMonth () {
      return this.calendar().selectPreviousMonth()
    }

    private calendar () {
      return this.calendar_
    }

    private setupDatabase (options) {
      BaseModel.setDb(new Database(this.logger(), options))
    }

    private logger () {
      return this.logger_
    }

    private setLogger (logger) {
      this.logger_ = logger
    }

    addAccount (o) {
      return CommandService.instance().execute('AddAccount', o)
    }

    addCategoryGroup (o) {
      return CommandService.instance().execute('AddCategoryGroup', o)
    }

    addCategory (o) {
      return CommandService.instance().execute('AddCategory', o)
    }

    removeCategory (o) {
      return CommandService.instance().execute('RemoveCategory', o)
    }

    removeCategoryGroup (o) {
      return CommandService.instance().execute('RemoveCategoryGroup', o)
    }

    assignMoney (o) {
      const { to, amount } = o
      this.moveMoney({ from: Setting.get('readyToAssignId'), to, amount, createdMonth: Calendar.instance().startOfMonth() })
    }

    addTransaction (o) {
      return CommandService.instance().execute('AddTransaction', o)
    }

    removeTransaction (o) {
      return CommandService.instance().execute('RemoveTransaction', o)
    }

    moveMoney (o) {
      return CommandService.instance().execute('AddTransfer', o)
    }

    private registerCommands () {
      CommandService.instance().registerAll()
    }

    addTarget (o) {
      return CommandService.instance().execute('AddTarget', o)
    }

    convertToOffBudgetAccount (accountId) {
      CommandService.instance().execute('ConvertAccount', { accountId })
    }

    undo () {
      CommandService.instance().undo()
      return this
    }

    redo () {
      CommandService.instance().redo()
      return this
    }

    importFromRegister (path) {
      ImportService.instance().importFromRegister(path)
    }

    importFromBudget (path) {
      ImportService.instance().importFromBudget(path)
    }

    private readyToAssign () {
      return _rupee(Category.getAllAssigned(Setting.get('readyToAssignId')))
    }

    private assignedThisMonth (categoryId) {
      const month = this.getSelectedMonth()
      return Category.getAssignedOfMonth(categoryId, month)
    }

    private firstTransferToReadyToAssign () {
      const transferDates = Transfer.getAll().filter(x => x.to === Setting.get('readyToAssignId')).map(x => x.createdMonth)
      transferDates.sort((a, b) => a - b)
      return transferDates.length ? transferDates[0] : -Infinity
    }

    public availableThisMonth (categoryId) {
      const month = this.getSelectedMonth()
      return Category.getAvailableOfMonth(categoryId, month)
    }

    private activityThisMonth (categoryId) {
      const month = this.getSelectedMonth()
      return Category.getActivityOfMonth(categoryId, month)
    }

    private renderCategories_ () {
      this.logger().log('Category Groups:')
      const groups = CategoryGroup.getAll()
      for (const group of groups) {
        const categories = Category.getByParentId(group.id)

        let totalAssignedThisMonth = 0
        let totalActivityThisMonth = 0
        let totalAvailableThisMonth = 0

        for (const category of categories) {
          category.assignedThisMonth = this.assignedThisMonth(category.id)
          category.activityThisMonth = this.activityThisMonth(category.id)
          category.availableThisMonth = this.availableThisMonth(category.id)

          totalAssignedThisMonth += category.assignedThisMonth
          totalActivityThisMonth += category.activityThisMonth
          totalAvailableThisMonth += category.availableThisMonth
        }

        this.logger().log(`${sprintf('%-29s', group.name)} ${_rupee(totalAssignedThisMonth)} | ${_rupee(totalActivityThisMonth)} | ${_rupee(totalAvailableThisMonth)}`)
        for (const category of categories) {
          this.logger().log(`    ${sprintf('%-25s', category.name)} ${_rupee(category.assignedThisMonth)} | ${_rupee(category.activityThisMonth)} | ${_rupee(category.availableThisMonth)}  `)
          this.renderTargets_(category.id)
        }
      }
    }

    private renderTransactions_ () {
      this.logger().log('Transactions:')
      const transactions = Transaction.getAll()

      for (const transaction of transactions) {
        this.logger().log(`${dateFromUnixMs(transaction.createdDay)} | ${Account.getNameFromId(transaction.accountId)}  | ${transaction.payee} | ${Category.getNameFromId(transaction.categoryId)} | ${transaction.memo} | ${transaction.outflow} | ${transaction.inflow} | ${transaction.cleared}`)
      }
    }

    private renderAccounts_ () {
      this.logger().log('Accounts: ')
      const accounts = Account.getAll()
      for (const account of accounts) {
        // Add account init amount as a transaction
        this.logger().log(`${sprintf('%-20s', account.name)} ${_rupee(Account.getBalance(account.id))}`)
      }
    }

    private renderTargets_ (categoryId) {
      const assignedThisMonth = this.assignedThisMonth(categoryId)
      const target = Target.getByCategoryId(categoryId)
      if (target && (target.createdMonth <= this.getSelectedMonth())) { this.logger().log(`             --- Every ${target.every} ${target.type} ${_rupee(target.amount)} ( You need ${_rupee((target.amount / target.every) - (assignedThisMonth + Category.getAllActivity(categoryId)))} this ${target.type})`) }
    }

    render () {
      this.logger().log('\n--- BUDGET APP ---')
      this.logger().log(`Month: ${this.printSelectedMonth()}`)
      this.logger().log(`Year: ${this.printSelectedYear()}`)
      this.logger().log(`Ready to assign :    ${this.readyToAssign()}`)

      this.renderAccounts_()
      this.renderCategories_()
      // this.renderTransactions_();
      return this
    }
}

export default BudgetApplication
