// import { commands } from "../commands/index"
import Account from "../models/Account"
import Category from "../models/Category"
import CategoryGroup from "../models/CategoryGroup"
import Setting from "../models/Setting"
import timeUtils from "../utils/timeUtils"
import BaseService from "./BaseService"
import CommandService from "./CommandService"
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
        { created: true, account: CommandService.instance().execute('AddAccount', {name, type: Account.TYPE_SAVINGS, amount: Number(data['Inflow'].trim().slice(1)) || 0 , 
        createdDay: timeUtils.unixMsFromDate(data['Date'])}) }
    }

    private _createCategoryGroupIfNeeded = (data) => {
        const name = data['Category Group']
        if (name === 'Inflow' || name === '') return Setting.get('moneyTreeId')
        const group = CategoryGroup.getByAttrWithValue('name', name)
        return group.length > 0 ? group[0] : CommandService.instance().execute('AddCategoryGroup', {name})
    }

    private _createCategoryIfNeeded = (data, parentId) => {
        const name = data['Category']
        if (name === 'Ready to Assign' || name === '') return Setting.get('readyToAssignId')
        const category = Category.getByAttrWithValue('name', name)
        return category.length > 0 ? category[0] : CommandService.instance().execute('AddCategory', {name, parentId})
    }

    private _createTransaction = (x, categoryId, accountId) => {
        CommandService.instance().execute('AddTransaction', {
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
        const content = fs.readFileSync(path,
            {encoding:'utf8', flag:'r'});
        this.processFile(content);
    }

        
    private processFile = (input) => {
        const { data } = Papa.parse(input, {header: true, transformHeader: this._trimQuotes}, )
        const actualData = data.reverse()
        // console.log(actualData)
        // console.log("========")
        actualData.forEach(x => 
            {
                const { created, account } = this._createAccountIfNeeded(x)
                if (created) return undefined
                const categoryGroup = this._createCategoryGroupIfNeeded(x)
                const category = this._createCategoryIfNeeded(x, categoryGroup.id)
                const transaction = this._createTransaction(x, category.id, account.id)
                
            })
    }
        // }}
}

export default ImportService