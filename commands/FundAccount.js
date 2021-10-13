import Category from '../models/Category.js'

class FundAccount {
    constructor() {
        this.prevAccountBalance = null
    }

    execute(o) {
        console.log("Executing add category")
        this.createdCategory = Category.save(o)
        return this.createdCategory;
    }
}

export default FundAccount