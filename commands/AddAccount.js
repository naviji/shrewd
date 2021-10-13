import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }
    
    execute (o) {
        this.createdAccount = Account.save(o)
        return this.createdAccount;
    }
    unexecute() {
        Account.delete(this.createdAccount.id)
    }
}

export default AddAccount