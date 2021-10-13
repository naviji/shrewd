import Category from '../models/Category.js'

class AssignMoney {
    constructor() {
        this.updatedCategory = null
    }

    execute(o) {
        this.updatedCategory = Category.save(o)
        return this.updatedCategory;
    }
    
    undo() {
        throw new Error("Not Implemented")
    }
}

export default AssignMoney