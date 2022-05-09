import CategoryGroup from '../models/CategoryGroup'
import Transaction from '../models/Transaction'
import RemoveCategory from './RemoveCategory'
import RemoveCommand from './RemoveCommand'
import { CategoryGroupEntity, TransactionEntity } from '../types/Model'
import { CommandParams } from '../types/Command'

class RemoveCategoryGroup extends RemoveCommand {
    public categoryIds: string[] = []
    public prevId: string | null = null
    public removeCategoryCommands: RemoveCategory[] = []

    model = () => CategoryGroup

    execute = (o: CommandParams.RemoveCategoryGroup) => {
      const { id, newCategoryId } = o
      this.prevId = id

      this.categoryIds = CategoryGroup.getAllCategoriesFromId(id).map((x: CategoryGroupEntity) => x.id)
      const transactionExists = !!Transaction.getAll().filter((x: TransactionEntity) => (this.categoryIds.indexOf(x.categoryId) !== -1)).length
      if (transactionExists && !newCategoryId) {
        throw new Error('Atleast one category contains a transaction; provide alternative category ID')
      }

      for (const categoryId of this.categoryIds) {
        const rmCategoryCmd = new RemoveCategory()
        rmCategoryCmd.execute({ id: categoryId, newCategoryId, moveTransfers: transactionExists })
        this.removeCategoryCommands.push(rmCategoryCmd)
      }

      super.execute(o)
    }

    undo = () => {
      super.undo()
      for (const removeCategoryCommand of this.removeCategoryCommands) {
        removeCategoryCommand.undo()
      }
    }

    redo = () => {
      for (const removeCategoryCommand of this.removeCategoryCommands) {
        removeCategoryCommand.redo()
      }
      super.redo()
    }
}

export default RemoveCategoryGroup
