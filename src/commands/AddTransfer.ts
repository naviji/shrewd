import Calendar from '../lib/Calendar';
import Transfer from '../models/Transfer'
import AddCommand from './AddCommand'
class AddTransfer extends AddCommand {
    model = () => Transfer

    execute = (o) => {
        const { createdMonth = Calendar.instance().startOfMonth(), accountId = '' } = o
        o = Object.assign(o, { createdMonth, accountId: accountId  })
        return super.execute(o);
    }
}

export default AddTransfer