import Category from '../models/Category.js'
import AddCommand from './AddCommand.js'

class AddCategory extends AddCommand {
    model = () => Category
}

export default AddCategory