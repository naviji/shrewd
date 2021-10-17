import Transaction from '../models/Transaction.js'
import AddCommand from './AddCommand.js'

class AddTransaction extends AddCommand {
    model = () => Transaction
}

export default AddTransaction