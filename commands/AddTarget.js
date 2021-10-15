import Target from '../models/Target.js'
import Calendar from '../utils/Calendar.js'
import AddCommand from './AddCommand.js'

class AddTarget extends AddCommand {
    model = () => Target

    execute = (o) => {
        return super.execute(Object.assign(o, { date: Calendar.instance().startOfMonth() }));
    }
}

export default AddTarget