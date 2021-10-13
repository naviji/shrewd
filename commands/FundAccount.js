import Category from '../models/Category.js'

class FundAccount {
    constructor() {
        this.prevAccountBalance = null
    }

    execute(o) {
        this.createdCategory = Category.save(o)
        return this.createdCategory;
    }

    undo() {
        throw new Error("Not Implemented")
    }
    
}

export default FundAccount