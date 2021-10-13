import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }
    
    execute (name) {
        console.log("Executing add account")
        this.createdAccount = Account.save(name)
        return this.createdAccount;
    }
}

export default AddAccount