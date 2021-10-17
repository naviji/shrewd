
import { setupDatabaseAndSynchronizer, switchClient } from './testUtils'

describe('Synchronizer should', function() {

  beforeEach(async () => {
		await setupDatabaseAndSynchronizer(1);
		await setupDatabaseAndSynchronizer(2);
		await switchClient(1);
	});


  it('create remote items', async () => {
    expect(1).toBe(1);
  })

})