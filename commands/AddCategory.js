import Category from '../models/Category.js'

class AddCategory {
    constructor() {
        this.createdCategory = null
    }

    execute(o) {
        this.createdCategory = Category.save(o)
        return this.createdCategory;
    }
}

export default AddCategory