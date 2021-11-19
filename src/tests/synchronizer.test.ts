
import Account from '../models/Account';
import { setupDatabaseAndSynchronizer, switchClient, afterAllCleanUp, synchronizerStart } from './testUtils'

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
    
    const account = await Account.save({type: Account.TYPE_SAVINGS, name: "Savings", amount: 1000 })
    // const accounts = Account.getAll()

    await synchronizerStart();
    
    // const remoteAccounts = 
    expect(1).toBe(1);
  })

})