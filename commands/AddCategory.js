import Category from '../models/Category.js'

class AddCategory {
    constructor() {
        this.createdCategory = null
    }
    
    execute (name) {
        console.log("Executing add category")
        this.createdCategory = Category.save(name)
        return this.createdCategory;
    }
}

export default AddCategory