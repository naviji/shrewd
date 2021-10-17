import BaseModel from "./BaseModel.js"
import Category from "./Category.js"

class CategoryGroup extends BaseModel {
    static tableName = () => "categoryGroup"

    static getAllCategoriesFromId = (id) => {
        return Category.getAll().filter(x => x.parentId === id)
    }
}

export default CategoryGroup