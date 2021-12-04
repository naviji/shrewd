import Account from "../models/Account";
import Category from "../models/Category";
import CategoryGroup from "../models/CategoryGroup";
import Target from "../models/Target";
import Transfer from "../models/Transfer";
import timeUtils from "../utils/timeUtils";
import { setupDatabase, switchClient } from "./testUtils";

describe('Target should calculate amount needed ', function() {
    const today = timeUtils.unixMsFromDate('01/01/2021')
    let account, categoryGroup, category

    beforeEach(async () => {
        await setupDatabase(1);
         await switchClient(1);

        account = Account.add({name: "Savings", amount: 1000, type: Account.TYPE_SAVINGS, createdDay: today })
        categoryGroup = CategoryGroup.add({name: "Wishlist"})
        category = await Category.add({name: "House", parentId: categoryGroup.id})
      });
  
    it('per month by date', async () => {
        const futureDay = timeUtils.unixMsFromDate('01/02/2021')
        const target = await Target.add({amount: 100, categoryId: category.id, endDate: futureDay})
        expect(Target.amountToSaveThisDay(target.id, today)).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, timeUtils.unixMsFromDate('15/01/2021'))).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, timeUtils.unixMsFromDate('01/02/2021'))).toBe(100)
    })

    it('per month by date if extra assigned on the prev month', async () => {
        const futureDay = timeUtils.unixMsFromDate('01/02/2021')
        const target = await Target.add({amount: 100, categoryId: category.id, endDate: futureDay})
        Category.assignMoney(category.id, 75, today)
        expect(Target.amountToSaveThisDay(target.id, today)).toBe(50)
        expect(Target.amountToSaveThisDay(target.id, futureDay)).toBe(25)
    })

    it('per month by date if repeat is turned on and current date is greater than end date', async () => {        
        const futureDay = timeUtils.unixMsFromDate('01/03/2021')
        const monthAfterTargetEnd = timeUtils.unixMsFromDate('01/04/2021')
        const target1 = await Target.add({amount: 300, categoryId: category.id, endDate: futureDay, frequency: 1})
        expect(Target.amountToSaveThisDay(target1.id, today)).toBe(100)
        expect(Target.amountToSaveThisDay(target1.id, futureDay)).toBe(300)
        expect(Target.amountToSaveThisDay(target1.id, monthAfterTargetEnd)).toBe(300)

        const target2 = await Target.add({amount: 300, categoryId: category.id, endDate: futureDay, frequency: 2})
        expect(Target.amountToSaveThisDay(target2.id, monthAfterTargetEnd)).toBe(150)
    })
  
  })