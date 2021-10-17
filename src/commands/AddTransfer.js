import Transfer from '../models/Transfer.js'
import AddCommand from './AddCommand.js'
class AddTransfer extends AddCommand {
    model = () => Transfer
}

export default AddTransfer