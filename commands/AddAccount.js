import Account from '../models/Account.js'
import AddCommand from './AddCommand.js'
class AddAccount extends AddCommand {
    model = () => Account
}

export default AddAccount