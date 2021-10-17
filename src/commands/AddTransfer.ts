import Transfer from '../models/Transfer'
import AddCommand from './AddCommand'
class AddTransfer extends AddCommand {
    model = () => Transfer
}

export default AddTransfer