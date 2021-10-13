import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }
    
    execute (ctx) {
        console.log("Executing add account")
        this.createdAccount = Account.save(ctx)
        return this.createdAccount;
    }
}

export default AddAccount