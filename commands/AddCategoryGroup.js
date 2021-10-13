import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.createdCategoryGroup = null
    }

    execute(o) {
        this.createdCategoryGroup = CategoryGroup.save(o)
        return this.createdCategoryGroup;
    }
}

export default AddCategoryGroup