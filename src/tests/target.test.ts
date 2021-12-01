import Account from "../models/Account";
import Category from "../models/Category";
import CategoryGroup from "../models/CategoryGroup";
import Target from "../models/Target";
import Transfer from "../models/Transfer";
import timeUtils from "../utils/timeUtils";
import { setupDatabase, switchClient } from "./testUtils";

describe('Target should calculate', function() {
    const today = timeUtils.unixMsFromDate('01/11/2021')
    let account, categoryGroup, category

    beforeEach(async () => {
        await setupDatabase(1);
         await switchClient(1);

        account = Account.add({name: "Savings", amount: 1000, type: Account.TYPE_SAVINGS, createdDay: today })
        categoryGroup = CategoryGroup.add({name: "Wishlist"})
        category = await Category.add({name: "House", parentId: categoryGroup.id})
      });
  
    it('amount needed per month by date', async () => {
        const futureDay = timeUtils.unixMsFromDate('01/12/2021')
        const target = await Target.add({amount: 100, categoryId: category.id, endDate: futureDay})
    
        expect(Target.amountToSaveThisMonth(target.id, today)).toBe(50)
        expect(Target.amountToSaveThisMonth(target.id, timeUtils.unixMsFromDate('01/12/2021'))).toBe(100)
        expect(Target.amountToSaveThisMonth(target.id, timeUtils.unixMsFromDate('15/11/2021'))).toBe(50)
    })
  
  })