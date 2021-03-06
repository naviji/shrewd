import Account from "../models/Account"
import Category from "../models/Category"
import CategoryGroup from "../models/CategoryGroup"
import Setting from "../models/Setting"
import Transaction from "../models/Transaction"
import Transfer from "../models/Transfer"
import timeUtils from "../utils/timeUtils"
import BaseService from "./BaseService"

const Papa = require('papaparse')
const fs  = require('fs')

class ImportService extends BaseService {
    private static instance_: ImportService
   

    private constructor() {
        super()
    }

    public static instance = () => {
        if (this.instance_) return this.instance_
        this.instance_ = new ImportService()
        return this.instance_
    }

    private _createAccountIfNeeded = (data) => {
        const name = data['Account']
        const account = Account.getByAttrWithValue('name', name)
        return account.length > 0 ? { created: false , account: account[0] } : 
        { created: true, account: Account.add({name, type: Account.TYPE_SAVINGS, amount: Number(data['Inflow'].trim().slice(1)) || 0 , 
        createdDay: timeUtils.unixMsFromDate(data['Date'])}) }
    }

    private _createCategoryGroupIfNeeded = (data) => {
        const name = data['Category Group']
        if (name === 'Inflow') return { id: Setting.get('readyToAssignId') }
        if (name === '') return { id: Setting.get('moneyTreeId') }
        const group = CategoryGroup.getByAttrWithValue('name', name)
        return group.length > 0 ? group[0] : CategoryGroup.add({name})
    }

    private _createCategoryIfNeeded = (data, parentId) => {
        const name = data['Category']
        if (name === 'Ready to Assign') return { id: Setting.get('readyToAssignId') }
        if (name === '') return { id: Setting.get('moneyTreeId') }
        const category = Category.getByAttrWithValue('name', name)
        return category.length > 0 ? category[0] : Category.add({name, parentId})
    }

    private _createTransaction = (x, categoryId, accountId) => {
        Transaction.add({
            createdDay: timeUtils.unixMsFromDate(x['Date']),
            payee: x['Payee'],
            categoryId: categoryId,
            accountId: accountId,
            memo: x['Memo'],
            outflow: Number(x['Outflow'].trim().substr(1)),
            inflow: Number(x['Inflow'].trim().substr(1)),
            cleared: true
        })
    }

    private _trimQuotes = (x) => {
        let start = x.indexOf('"')
        let end = x.indexOf('"', start+1)
        if (start >= 0 && end >=0 && start !== end) return x.slice(start+1, end)
        return x
    }


    public importFromRegister = (path) => {
        const processFile = (input) => {
            const { data } = Papa.parse(input, {header: true, transformHeader: this._trimQuotes}, )

            const _sortByDateandPayee = (a, b) => {
                const timeOfA = timeUtils.unixMsFromDate(a['Date'])
                const timeOfB = timeUtils.unixMsFromDate(b['Date'])
                if (timeOfA === timeOfB) {
                    return a['Payee'] < b['Payee'] ? -1 : a['Payee'] > b['Payee'] ? 1 : 0
                } else {
                    return timeOfA < timeOfB ? -1 : 1
                }
            }

            // Sorted by Payee to make sure "Starting Balance" transactions come before "Transfer" 
            // Also filter out scheduled transactions
            const orderedData = data.sort(_sortByDateandPayee)
                                    .filter(x =>  timeUtils.unixMsFromDate(x['Date']) <= timeUtils.timeInUnixMs())
            orderedData.forEach(x => 
                {
                    const { created, account } = this._createAccountIfNeeded(x)
                    if (created) return // creating an account already creates the transaction
                    const categoryGroup = this._createCategoryGroupIfNeeded(x)
                    const category = this._createCategoryIfNeeded(x, categoryGroup.id)
                    const transaction = this._createTransaction(x, category.id, account.id)
                    
                })
        }

        const content = fs.readFileSync(path,
            {encoding:'utf8', flag:'r'});
        processFile(content);
    }


    public importFromBudget = (path) => {
        const _getAmountFromString = (str) => {
            if (str.startsWith("-")) return -Number(str.slice(1).trim().substr(1))
            return Number(str.trim().substr(1))
        }
        const processFile = (input) => {
            const { data } = Papa.parse(input, {header: true, transformHeader: this._trimQuotes}, )
            data.forEach(x => 
                {
                    const categoryGroup = this._createCategoryGroupIfNeeded(x)
                    const category = this._createCategoryIfNeeded(x, categoryGroup.id)
                    const transfer = Transfer.add({
                        from: Setting.get('readyToAssignId'),
                        to: category.id,
                        amount: _getAmountFromString(x['Budgeted']),
                        createdMonth: timeUtils.unixMsFromMonth(x['Month'])
                    })
                })

            // console.log(Transfer.getAll())
        }

        const content = fs.readFileSync(path,
            {encoding:'utf8', flag:'r'});
        processFile(content);
    }

        
    
        // }}
}

export default ImportService