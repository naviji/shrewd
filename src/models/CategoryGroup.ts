import BaseModel from "./BaseModel"
import Category from "./Category"

class CategoryGroup extends BaseModel {
    static tableName = () => "categoryGroup"

    static fieldNames() {
        return ["id", "name"]
    }

    static getAllCategoriesFromId = (id) => {
        return Category.getAll().filter(x => x.parentId === id)
    }
}

export default CategoryGroup