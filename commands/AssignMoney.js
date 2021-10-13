import Category from '../models/Category.js'
import UpdateCommand from './UpdateCommand.js'

class AssignMoney extends UpdateCommand {
    model = () => Category
}

export default AssignMoney