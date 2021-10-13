import BaseModel from "./BaseModel.js"

class Category extends BaseModel {
    static tableName = () => "category"

    static save = (o) => {
        return super.save(o)
    }
}

export default Category