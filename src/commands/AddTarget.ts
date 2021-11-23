import Target from '../models/Target'
import Calendar from '../lib/Calendar'
import AddCommand from './AddCommand'

class AddTarget extends AddCommand {
    model = () => Target

    execute = (o) => {
        return super.execute(Object.assign(o, { createdMonth: Calendar.instance().startOfMonth() }));
    }
}

export default AddTarget