import Category from '../models/Category'
import AddCommand from './AddCommand'

class AddCategory extends AddCommand {
    model = () => Category
}

export default AddCategory