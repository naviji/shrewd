import Account from "../models/Account";
import Category from "../models/Category";
import CategoryGroup from "../models/CategoryGroup";
import Target from "../models/Target";
import timeUtils from "../utils/timeUtils";
import { setupDatabase, switchClient } from "./testUtils";

describe('Target should calculate', function() {

    beforeEach(async () => {
          await setupDatabase(1);
          await switchClient(1);
      });
  
    it('amount needed per month by date', async () => {
        const today = timeUtils.unixMsFromDate('01/11/2021')
        const futureDay = timeUtils.unixMsFromDate('01/12/2021')

        const account = await Account.save({type: Account.TYPE_SAVINGS, name: "Savings", amount: 1000, createdDay: today })
        const categoryGroup = await CategoryGroup.save({name: "Wishlist"})
        const category = await Category.save({name: "House", parentId: categoryGroup.id})
        const target = await Target.save({amount: 100, categoryId: category.id, endDate: futureDay})
    
        expect(Target.amountToSaveThisMonth(target.id, today)).toBe(0)
    })
  
  
  
  })