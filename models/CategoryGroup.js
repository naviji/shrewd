import BaseModel from "./BaseModel.js"

class CategoryGroup extends BaseModel {
    static tableName = () => "categoryGroup"

    static save = () => {
        super.save()
    }
}

export default CategoryGroup