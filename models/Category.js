import BaseModel from "./BaseModel.js"

class Category extends BaseModel {
    static tableName = () => "category"

    static save = (name, options) => {
        super.save(name, options)
    }
}

export default Category