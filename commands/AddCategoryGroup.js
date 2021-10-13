import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.createdCategoryGroup = null
    }

    execute(o) {
        console.log("Executing add category group")
        this.createdCategoryGroup = CategoryGroup.save(o)
        return this.createdCategoryGroup;
    }
}

export default AddCategoryGroup