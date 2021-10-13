import BaseModel from "./BaseModel.js"

class CategoryGroup extends BaseModel {
    static tableName = () => "categoryGroup"

    static save = (name, options) => {
        super.save(name, options)
    }
}

export default CategoryGroup