import BaseItem from "./BaseItem"
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

    static getByCategoryId = (categoryId) => {
        return Target.getAll()
                     .find(target => target.categoryId === categoryId)
    }

    static amountToSaveThisMonth = (targetId, date) => {
        const target = Target.getById(targetId)
        // const funded = app.availableThisMonth(categoryId)
        // const amountLeft = totalNeeded - funded
        // console.log(`${totalNeeded} by ${date}`)
        // const monthsLeft = timeUtils.getMonthsTillDate(date)
        // const neededPerMonth = (monthsLeft === 0) ? amountLeft : (amountLeft/monthsLeft)
        // if (neededPerMonth > 0) {
        //     console.log(`Assign ${neededPerMonth} or more this month to stay on track.`)
        // } else {
        //     console.log(`You've reached your target!`)
        // }

        return 0;


    }
}

export default Target