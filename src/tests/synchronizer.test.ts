
import Account from '../models/Account';
import BaseItem from '../models/BaseItem';
import BaseModel, { ModelType } from '../models/BaseModel';
import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';
import Setting from '../models/Setting';
import Target from '../models/Target';
import Transaction from '../models/Transaction';
import Transfer from '../models/Transfer';
import timeUtils from '../utils/timeUtils';
import { setupDatabaseAndSynchronizer, switchClient, afterAllCleanUp, synchronizerStart } from './testUtils'
import { remoteItemsByType } from './testUtilsSync';



async function localSameAsRemote(expect, type) {
  const ItemClass = BaseItem.itemClass(type)
  const locals = ItemClass.getAll()
  const remotes = await remoteItemsByType([type])

  for (let local of locals) {
    const remote = remotes.find(x => x.id == local.id)
    for (let field of ItemClass.fieldNames()) {
      expect(remote[field]).toBe(local[field]) 
    }
  }

}

describe('Synchronizer should', function() {

  beforeEach(async () => {
		await setupDatabaseAndSynchronizer(1);
		await setupDatabaseAndSynchronizer(2);
		await switchClient(1);
	});

  afterAll(async () => {
		await afterAllCleanUp();
	});


  it('create remote items', async () => {
    
    const account = await Account.save({type: Account.TYPE_SAVINGS, name: "Savings", amount: 1000, createdDay: timeUtils.timeInUnixMs()})
    const categoryGroup = await CategoryGroup.save({name: "Wishlist"})
    const category = await Category.save({name: "House", parentId: categoryGroup.id})
    const target = await Target.save({amount: 100, categoryId: category.id, endDate: timeUtils.timeInUnixMs()})
    const transfer = await Transfer.save({from: Setting.get('readyToAssignId'), to: category.id, amount: 100, createdMonth: timeUtils.timeInUnixMs()})
    const transaction = await Transaction.save({
      createdDay: timeUtils.timeInUnixMs(),
      payee: "Raju",
      categoryId: category.id,
      accountId: account.id,
      memo: "Gift from Raju",
      outflow: 0,
      inflow: 1000,
      cleared: true
  })

    await synchronizerStart();

    const modelTypes = [BaseModel.TYPE_ACCOUNT, BaseModel.TYPE_CATEGORY_GROUP, BaseModel.TYPE_CATEGORY, BaseModel.TYPE_TARGET, BaseModel.TYPE_TRANSFER, BaseModel.TYPE_TRANSACTION]

    for (const modelType of modelTypes) {
      await localSameAsRemote(expect, modelType)
    }

  })



})