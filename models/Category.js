import BaseModel from "./BaseModel.js"

class Category extends BaseModel {
    static tableName = () => "category"
}

export default Category