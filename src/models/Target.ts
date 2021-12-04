import timeUtils from "../utils/timeUtils"
import BaseItem from "./BaseItem"
import Category from "./Category"
class Target extends BaseItem {
    static tableName = () => "Target"

    static fieldNames() {
        return ["id", "updatedAt", "createdAt", "amount", "categoryId", "endDate", "frequency"]
    }

    static fieldTypes() {
        return {
            "amount": Number,
            "endDate": Number,
            "frequency": Number
        }
    }


    static save =  (o) => {
        const { id, createdMonth, frequency } = o
        if (!id && !createdMonth) {
            // New accounts are open by default
            o.createdMonth = timeUtils.monthInUnixMs()
        }
        if (!id && !frequency) {
            // New accounts are open by default
            o.frequency = 0
        }
        
        return super.save(o);
    }

    static getByCategoryId = (categoryId) => {
        return Target.getAll()
                     .find(target => target.categoryId === categoryId)
    }

    static amountToSaveThisDay = (targetId, currDate) => {
        let target = Target.getById(targetId)
        const { endDate, frequency } = target
        if ((currDate > endDate) && (frequency > 0)) {
            target = Target.save({...target, endDate: timeUtils.addMonthsToDateUnixMs(endDate, frequency)}) 
        }
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