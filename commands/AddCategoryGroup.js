import CategoryGroup from '../models/CategoryGroup.js'

class AddCategoryGroup {
    constructor() {
        this.oldArgs = null
        this.createdCategoryGroup = null
    }

    execute(o) {
        this.oldArgs = o
        this.createdCategoryGroup = CategoryGroup.save(o)
        return this.createdCategoryGroup;
    }

    undo() {
        CategoryGroup.deleteById({id : this.createdCategoryGroup.id})
        this.createdCategoryGroup = null
    }

    redo() {
        this.createdCategoryGroup = CategoryGroup.save(this.oldArgs)
        return this.createdCategoryGroup;
    }
}

export default AddCategoryGroup