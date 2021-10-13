import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.createdCategoryGroup = null
    }

    execute(o) {
        this.createdCategoryGroup = CategoryGroup.save(o)
        return this.createdCategoryGroup;
    }

    undo() {
        throw new Error("Not Implemented")
    }
}

export default AddCategoryGroup