import Target from '../models/Target'
import AddCommand from './AddCommand'

class AddTarget extends AddCommand {
    model = () => Target
}

export default AddTarget
