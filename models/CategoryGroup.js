import BaseModel from "./BaseModel.js"

class CategoryGroup extends BaseModel {
    static tableName = () => "categoryGroup"

    static save = (options) => {
        return super.save(options)
    }
}

export default CategoryGroup