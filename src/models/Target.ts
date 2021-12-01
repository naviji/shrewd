import timeUtils from "../utils/timeUtils"
import BaseItem from "./BaseItem"
import Category from "./Category"
class Target extends BaseItem {
    static tableName = () => "Target"

    static fieldNames() {
        return ["id", "updatedAt", "createdAt", "amount", "categoryId", "endDate"]
    }

    static fieldTypes() {
        return {
            "amount": Number,
            "endDate": Number
        }
    }


    static save =  (o) => {
        const { id, createdMonth } = o
        if (!id && !createdMonth) {
            // New accounts are open by default
            o.createdMonth = timeUtils.monthInUnixMs()
        }
        
        return super.save(o);
    }

    static getByCategoryId = (categoryId) => {
        return Target.getAll()
                     .find(target => target.categoryId === categoryId)
    }

    static amountToSaveThisDay = (targetId, currDate) => {
        const target = Target.getById(targetId)
        const currMonth = timeUtils.monthFromUnixMs(currDate)
        const prevMonth = timeUtils.getPrevMonthUnixMs(currDate)
        const funded = Category.getAvailableOfMonth(target.categoryId, prevMonth)
        const amountLeft = target.amount - funded
        const monthsLeft = timeUtils.getMonthsTillDate(currMonth, target.endDate)
        const neededPerMonth = (amountLeft/monthsLeft)
        return neededPerMonth
    }
}

export default Target