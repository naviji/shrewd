import Transaction from '../models/Transaction'
import AddCommand from './AddCommand'

class AddTransaction extends AddCommand {
    model = () => Transaction
}

export default AddTransaction