import Account from "../models/Account";
import Category from "../models/Category";
import CategoryGroup from "../models/CategoryGroup";
import Target from "../models/Target";
import Transfer from "../models/Transfer";
import timeUtils from "../utils/timeUtils";
import { setupDatabase, switchClient } from "./testUtils";

describe('Target should calculate', function() {
    const today = timeUtils.unixMsFromDate('01/01/2021')
    let account, categoryGroup, category

    beforeEach(async () => {
        await setupDatabase(1);
         await switchClient(1);

        account = Account.add({name: "Savings", amount: 1000, type: Account.TYPE_SAVINGS, createdDay: today })
        categoryGroup = CategoryGroup.add({name: "Wishlist"})
        category = await Category.add({name: "House", parentId: categoryGroup.id})
      });
  
    it('amount needed per month by date', async () => {
        const futureDay = timeUtils.unixMsFromDate('01/02/2021')
        const target = await Target.add({amount: 100, categoryId: category.id, endDate: futureDay})
        expect(Target.amountToSaveThisDay(target.id, today)).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, timeUtils.unixMsFromDate('15/01/2021'))).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, timeUtils.unixMsFromDate('01/02/2021'))).toBe(100)
    })

    it('amount needed per month by date if extra assigned on the prev month', async () => {
        /* TODO : Support monthly repeats
            If amountToSaveThisMonth is called with currentDate > endDate
            either the target is not needed anymore (since we've passed the target date)
            or the target endDate needs to be reset to a suitable value in case REPEAT is enabled.

            For weekly targets, the time to check available becomes weekly
        */
        
        const futureDay = timeUtils.unixMsFromDate('01/02/2021')
        const target = await Target.add({amount: 100, categoryId: category.id, endDate: futureDay})
        Category.assignMoney(category.id, 75, today)
        expect(Target.amountToSaveThisDay(target.id, today)).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, futureDay)).toBe(25)

    })
  
  })