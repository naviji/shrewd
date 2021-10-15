import Category from '../models/Category.js'
import CategoryGroup from '../models/CategoryGroup.js'
import Transaction from '../models/Transaction.js'
import Transfer from '../models/Transfer.js'
import RemoveCategory from './RemoveCategory.js'
import RemoveCommand from './RemoveCommand.js'

class RemoveCategoryGroup extends RemoveCommand {
    model = () => CategoryGroup

    constructor () {
        super()
        this.categoryIds = []
        this.prevId = null
        this.removeCategoryCommands = []
    }

    execute = (o) => {
        const { id, newCategoryId } = o
        this.prevId = id

        this.categoryIds = CategoryGroup.getAllCategoriesFromId(id).map(x => x.id)
        const transactionExists = !!Transaction.getAll().filter( x => (this.categoryIds.indexOf(x.categoryId) !== -1)).length
        if (transactionExists && !newCategoryId)
            throw new Error("Atleast one category contains a transaction; provide alternative category ID")


        for (let categoryId of this.categoryIds) {
            const rmCategoryCmd = new RemoveCategory()
            rmCategoryCmd.execute({id: categoryId, newCategoryId, moveTransfers: transactionExists})
            this.removeCategoryCommands.push(rmCategoryCmd)
        }

        super.execute(o)
    }

    undo = () => {
        super.undo()
        for ( let removeCategoryCommand of this.removeCategoryCommands) {
            removeCategoryCommand.undo()
        }
    }

    redo = () => {
        for ( let removeCategoryCommand of this.removeCategoryCommands) {
            removeCategoryCommand.redo()
        }
        super.redo()
    }


}

export default RemoveCategoryGroup