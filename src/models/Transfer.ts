import BaseItem from './BaseItem'
import timeUtils from '../utils/timeUtils'

class Transfer extends BaseItem {
    static tableName = () => 'Transfer'

    static fieldNames () {
      return ['id', 'from', 'to', 'amount', 'updatedAt', 'createdAt', 'createdMonth', 'accountId']
    }

    static fieldTypes () {
      return {
        amount: Number,
        createdMonth: Number
      }
    }

    static save = (o) => {
      const { id, accountId, createdMonth } = o

      if (!id && !accountId) {
        o.accountId = ''
      }

      if (!id && !createdMonth) {
        o.createdMonth = timeUtils.monthInUnixMs()
      }

      return super.save(o)
    }
}

export default Transfer
