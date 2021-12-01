import Target from '../models/Target'
import Calendar from '../lib/Calendar'
import AddCommand from './AddCommand'

class AddTarget extends AddCommand {
    model = () => Target

}

export default AddTarget