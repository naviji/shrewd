import Target from '../models/Target.js'
import AddCommand from './AddCommand.js'

class AddTarget extends AddCommand {
    model = () => Target
}

export default AddTarget