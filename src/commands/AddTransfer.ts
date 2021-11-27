import Calendar from '../lib/Calendar';
import Transfer from '../models/Transfer'
import AddCommand from './AddCommand'
class AddTransfer extends AddCommand {
    model = () => Transfer

    execute = (o) => {
        const { createdMonth } = o
        o = Object.assign(o, { createdMonth: createdMonth || Calendar.instance().startOfMonth() })
        return super.execute(o);
    }
}

export default AddTransfer