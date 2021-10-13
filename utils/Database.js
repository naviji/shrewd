class Database {

    categoryGroups = []
    transactions = []
    accounts = []

    constructor() {
        console.log("Database initialized")
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

    setCategoryGroups(categoryGroup) {
        this.categoryGroups.push(categoryGroup)
    }
    setTransactions() {
        this.transactions.push(transaction)
    }
    setAccounts(account) {
        this.accounts.push(account)
    }

}

export default Database