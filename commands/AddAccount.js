import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }

    execute(name, options) {
        console.log("Executing add account with")
        this.createdAccount = Account.save(name, options)
        return this.createdAccount;
    }
    unexecute(account) {
        console.log("Executing add account with")
        Account.delete(account.accId)
    }
}

export default AddAccount