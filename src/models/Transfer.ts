import BaseItem from "./BaseItem"
import Calendar from "../lib/Calendar"
import Setting from "./Setting"

class Transfer extends BaseItem {
    static tableName = () => "Transfer"

    static fieldNames() {
        return ["id", "from", "to", "amount", "updatedAt", "createdAt", "createdMonth"]
    }

    static fieldTypes() {
        return {
            "amount": Number,
            "createdMonth": Number
        }
    }

    static save = (o) => {
        // TODO: Create an update function for this purpose?
        // return super.save({...o, month: o.month ? o.month : Calendar.instance().timeInUnixMs()})
        if (o.to === Setting.get('readyToAssignId')) {
            console.log(`Transfering ${o.amount} to readyToAssign`)
        }
        return super.save(o)

    }

}

export default Transfer