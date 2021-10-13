import BaseModel from "./BaseModel.js"

class Category extends BaseModel {
    static tableName = () => "category"

    static save = () => {
        super.save()
    }
}

export default Category