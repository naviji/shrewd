import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.createdCategoryGroup = null
    }

    execute(name, options) {
        console.log("Executing add category group")
        this.createdCategoryGroup = CategoryGroup.save(name, options)
        return this.createdCategoryGroup;
    }
}

export default AddCategoryGroup