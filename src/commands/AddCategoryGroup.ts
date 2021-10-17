import CategoryGroup from '../models/CategoryGroup'
import AddCommand from './AddCommand'

class AddCategoryGroup extends AddCommand {
    model = () => CategoryGroup
}

export default AddCategoryGroup