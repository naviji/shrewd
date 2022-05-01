
import Database from '../lib/Database'
import Logger, { LogLevel } from '../lib/Logger'
import CommandService from '../services/CommandService'
import Account from '../models/Account'
import Transaction from '../models/Transaction'
import CategoryGroup from '../models/CategoryGroup'
import Category from '../models/Category'
import BaseModel from '../models/BaseModel'
import Calendar from '../lib/Calendar'
import { dateFromUnixMs } from '../utils/timeUtils'
import Target from '../models/Target'
import Setting from '../models/Setting'
import ImportService from '../services/ImportService'
import { CommandParams } from '../types/Command'

const sprintf = require('sprintf-js').sprintf

// const appLogger = new Logger()

function _rupee (amount: number) {
  return sprintf('%10.2f', amount / 100)
}

interface AppOptions {
  debugMode: boolean,
  saveChanges: boolean,
  loadData: boolean
}

class BudgetApplication {
    private calendar_ : Calendar = Calendar.instance()
    private logger_: Logger | null = null

    start (options: AppOptions) {
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

    private setupDatabase (options: AppOptions) {
      BaseModel.setDb(new Database(this.logger(), options))
    }

    private logger () {
      if (this.logger_) return this.logger_
      return new Logger()
    }

    private setLogger (logger: Logger) {
      this.logger_ = logger
    }

    addAccount (o: CommandParams.AddAccount) {
      return CommandService.instance().execute('AddAccount', o)
    }

    addCategoryGroup (o: CommandParams.AddCategoryGroup) {
      return CommandService.instance().execute('AddCategoryGroup', o)
    }

    addCategory (o: CommandParams.AddCategory) {
      return CommandService.instance().execute('AddCategory', o)
    }

    removeCategory (o: CommandParams.RemoveCategory) {
      return CommandService.instance().execute('RemoveCategory', o)
    }

    removeCategoryGroup (o: CommandParams.RemoveCategoryGroup) {
      return CommandService.instance().execute('RemoveCategoryGroup', o)
    }

    assignMoney (o: CommandParams.AssingMoney) {
      const { to, amount } = o
      this.moveMoney({
        from: Setting.get('readyToAssignId'),
        to,
        amount,
        createdMonth: Calendar.instance().startOfMonth()
      })
    }

    addTransaction (o: CommandParams.AddTransaction) {
      return CommandService.instance().execute('AddTransaction', o)
    }

    removeTransaction (o: {id: string}) {
      return CommandService.instance().execute('RemoveTransaction', o)
    }

    moveMoney (o: CommandParams.MoveMoney) {
      return CommandService.instance().execute('AddTransfer', o)
    }

    private registerCommands () {
      CommandService.instance().registerAll()
    }

    addTarget (o: CommandParams.AddTarget) {
      return CommandService.instance().execute('AddTarget', o)
    }

    convertToOffBudgetAccount (accountId: string) {
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

    importFromRegister (path: string) {
      ImportService.instance().importFromRegister(path)
    }

    importFromBudget (path: string) {
      ImportService.instance().importFromBudget(path)
    }

    private readyToAssign () {
      return _rupee(Category.getAllAssigned(Setting.get('readyToAssignId')))
    }

    private assignedThisMonth (categoryId: string) {
      const month = this.getSelectedMonth()
      return Category.getAssignedOfMonth(categoryId, month)
    }

    public availableThisMonth (categoryId: string) {
      const month = this.getSelectedMonth()
      return Category.getAvailableOfMonth(categoryId, month)
    }

    private activityThisMonth (categoryId: string) {
      const month = this.getSelectedMonth()
      return Category.getActivityOfMonth(categoryId, month)
    }

    private renderCategories_ () {
      this.logger().info('Category Groups:')
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

        this.logger().info(`${sprintf('%-29s', group.name)} ${_rupee(totalAssignedThisMonth)} | ${_rupee(totalActivityThisMonth)} | ${_rupee(totalAvailableThisMonth)}`)
        for (const category of categories) {
          this.logger().info(`    ${sprintf('%-25s', category.name)} ${_rupee(category.assignedThisMonth)} | ${_rupee(category.activityThisMonth)} | ${_rupee(category.availableThisMonth)}  `)
          this.renderTargets_(category.id)
        }
      }
    }

    private renderTransactions_ () {
      this.logger().info('Transactions:')
      const transactions = Transaction.getAll()

      for (const transaction of transactions) {
        this.logger().info(`${dateFromUnixMs(transaction.createdDay)} | ${Account.getNameFromId(transaction.accountId)}  | ${transaction.payee} | ${Category.getNameFromId(transaction.categoryId)} | ${transaction.memo} | ${transaction.outflow} | ${transaction.inflow} | ${transaction.cleared}`)
      }
    }

    private renderAccounts_ () {
      this.logger().info('Accounts: ')
      const accounts = Account.getAll()
      for (const account of accounts) {
        // Add account init amount as a transaction
        this.logger().info(`${sprintf('%-20s', account.name)} ${_rupee(Account.getBalance(account.id))}`)
      }
    }

    private renderTargets_ (categoryId: string) {
      const assignedThisMonth = this.assignedThisMonth(categoryId)
      const target = Target.getByCategoryId(categoryId)
      if (target && (target.createdMonth <= this.getSelectedMonth())) { this.logger().info(`             --- Every ${target.every} ${target.type} ${_rupee(target.amount)} ( You need ${_rupee((target.amount / target.every) - (assignedThisMonth + Category.getAllActivity(categoryId)))} this ${target.type})`) }
    }

    render () {
      this.logger().info('\n--- BUDGET APP ---')
      this.logger().info(`Month: ${this.printSelectedMonth()}`)
      this.logger().info(`Year: ${this.printSelectedYear()}`)
      this.logger().info(`Ready to assign :    ${this.readyToAssign()}`)

      this.renderAccounts_()
      this.renderCategories_()
      // this.renderTransactions_();
      return this
    }
}

export default BudgetApplication
