import BaseModel from "./BaseModel.js"
import Calendar from "../utils/Calendar.js"
import Transfer from "./Transfer.js"
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

    static getAmountAssigned = (id) => {
        const currTime = Calendar.instance().timeInUnixMs()
        return Transfer.getAll().filter(x => x.categoryId === id && x.month === currTime)
                                .map(x => x.amount)
                                .reduce((a, b) => a+b, 0)
    }

    static getNameFromId = (id) => {
        return Category.getById(id).name
    }
}

export default Category