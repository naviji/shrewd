import Account from '../models/Account.js'

class AddAccount {
    constructor() {
        this.oldArgs = null
        this.createdAccount = null
    }
    
    execute (o) {
        this.oldArgs = o
        this.createdAccount = Account.save(o)
        return this.createdAccount;
    }

    undo() {
        Account.deleteById({id: this.createdAccount.id})
        this.createdAccount = null
    }

    redo() {
        this.createdAccount = Account.save(this.oldArgs)
        return this.createdAccount;
    }
}

export default AddAccount