import Transfer from '../models/Transfer.js'
import AddCommand from './AddCommand.js'
import Calendar from '../utils/Calendar.js'
class AssignMoney extends AddCommand {
    model = () => Transfer
}

export default AssignMoney