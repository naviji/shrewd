import BaseModel from "./BaseModel.js"
import Calendar from "../utils/Calendar.js"

class Transfer extends BaseModel {
    static tableName = () => "transfer"

    static save = (o) => {
        return super.save({...o, month: Calendar.instance().timeInUnixMs()})
    }

}

export default Transfer