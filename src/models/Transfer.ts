import BaseItem from "./BaseItem"
import Calendar from "../lib/Calendar"

class Transfer extends BaseItem {
    static tableName = () => "Transfer"

    static fieldNames() {
        return ["id", "categoryId", "amount", "date", "updatedAt", "createdAt"]
    }

    static save = (o) => {
        // TODO: Create an update function for this purpose?
        // return super.save({...o, month: o.month ? o.month : Calendar.instance().timeInUnixMs()})
        return super.save({...o, date: o.date ? o.date : Calendar.instance().timeInUnixMs()})

    }

}

export default Transfer