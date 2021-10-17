import CategoryGroup from '../models/CategoryGroup.js'
import AddCommand from './AddCommand.js'

class AddCategoryGroup extends AddCommand {
    model = () => CategoryGroup
}

export default AddCategoryGroup