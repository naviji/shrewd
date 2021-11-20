import BaseItem from "./BaseItem"
class Target extends BaseItem {
    static tableName = () => "Target"

    static fieldNames() {
        return ["id", "name", "updatedAt", "createdAt"]
    }

    static getByCategoryId = (categoryId)=>{
        return Target.getAll()
                     .find(target => target.categoryId === categoryId)
    }
}

export default Target