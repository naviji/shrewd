import BaseModel from "./BaseModel"
class Target extends BaseModel {
    static tableName = () => "Target"

    static getByCategoryId = (categoryId)=>{
        return Target.getAll()
                     .find(target => target.categoryId === categoryId)
    }
}

export default Target