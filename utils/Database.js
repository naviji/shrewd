
class Database {

    categoryGroups = new Map()
    transactions = new Map()
    accounts = new Map()
    categories = new Map()


    constructor() {
        console.log("Database initialized")
    }

    save(tableName, o) {
        console.log("table name = ", tableName)
        if (tableName === "account") {
            const id = Math.floor(Math.random()*10000000)
            const created =  Date.now()
            const updated =  Date.now()
            
            const account = { ...o ,id,  created , updated }
            this.setAccount(account)
            return account
        }
        else if (tableName=== "categoryGroup") {
            const id = Math.floor(Math.random()*10000000)
            const created =  Date.now()
            const updated =  Date.now()
            const group = { ...o, id , created , updated }
            this.setCategoryGroup(group)
            return group
        }
        else if (tableName=== "category") {
            const id = Math.floor(Math.random()*10000000)
            const created =  Date.now()
            const updated =  Date.now()
            const category = { ...o, id ,created , updated }
            this.setCategory(category)
            return category
        }

        return { error : true }
    }
    getCategoryGroups() {
        return this.categoryGroups
    }
    getTransactions() {
        return this.transactions
    }
    getAccounts() {
        return this.accounts
    }

    setCategoryGroup(categoryGroup) {
        this.categoryGroups[categoryGroup.id] = categoryGroup;
    }
    setCategory(category) {
        this.categories[category.id] = category
    }
    setTransactions() {
        this.transactions.push(transaction)
    }
    setAccount(account) {
        this.accounts[account.id] = account;
    }

}

export default Database