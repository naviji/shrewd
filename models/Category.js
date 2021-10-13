import BaseModel from "./BaseModel.js"

class Category extends BaseModel {
    static tableName = () => "category"

    static save =  (o) => {
        const { id, amount } = o
        if (!id && !amount) {
            // New Categories have default amount 0
            o.amount = 0
        }
        return super.save(o);
    }
}

export default Category