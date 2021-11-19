import BaseItem from "./BaseItem"
import Category from "./Category"

class CategoryGroup extends BaseItem {
    static tableName = () => "CategoryGroup"

    static fieldNames() {
        return ["id", "name"]
    }

    static getAllCategoriesFromId = (id) => {
        return Category.getAll().filter(x => x.parentId === id)
    }
}

export default CategoryGroup