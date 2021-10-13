import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }
    
    execute (o) {
        console.log("Executing add account")
        this.createdAccount = Account.save(o)
        return this.createdAccount;
    }
    unexecute() {
        console.log("Executing add account with")
        Account.delete(this.createdAccount.id)
    }
}

export default AddAccount