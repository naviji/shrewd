import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.createdAccount = null
    }
    
    execute (o) {
        this.createdAccount = Account.save(o)
        return this.createdAccount;
    }

    undo() {
        throw new Error("Not Implemented")
    }
}

export default AddAccount