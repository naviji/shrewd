import Category from '../models/Category.js'

class AddCategory {
    constructor() {
        this.createdCategory = null
    }

    execute(name, options) {
        console.log("Executing add category")
        this.createdCategory = Category.save(name, options)
        return this.createdCategory;
    }
}

export default AddCategory