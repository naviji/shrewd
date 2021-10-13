import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.createdCategoryGroup = null
    }
    
    execute (name) {
        console.log("Executing add category group")
        this.createdCategoryGroup = CategoryGroup.save(name)
        return this.createdCategoryGroup;
    }
}

export default AddCategoryGroup