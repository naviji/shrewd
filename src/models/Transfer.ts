import BaseModel from "./BaseModel"
import Calendar from "../utils/Calendar"

class Transfer extends BaseModel {
    static tableName = () => "transfer"

    static save = (o) => {
        // TODO: Create an update function for this purpose?
        // return super.save({...o, month: o.month ? o.month : Calendar.instance().timeInUnixMs()})
        return super.save({...o, date: o.date ? o.date : Calendar.instance().timeInUnixMs()})

    }

}

export default Transfer