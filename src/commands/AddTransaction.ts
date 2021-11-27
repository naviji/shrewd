import Setting from '../models/Setting'
import Transaction from '../models/Transaction'
import timeUtils from '../utils/timeUtils'
import AddCommand from './AddCommand'
import AddTransfer from './AddTransfer'

class AddTransaction extends AddCommand {
    private addTransferCmd

    model = () => Transaction

    constructor() {
        super()
        this.addTransferCmd = null
    }


    execute (o) {
        const { categoryId, createdDay, inflow, outflow } =  o 

        const createdTransaction = super.execute(o)

        // Assumption: All transaction made to readyToAssign are Inflows;
        // Cannot spend from ready to assign directly
        // 249002
        if ( categoryId === Setting.get('readyToAssignId') || categoryId === Setting.get('moneyTreeId')) { 
            this.addTransferCmd = new AddTransfer()
            this.addTransferCmd.execute({
                from: Setting.get('moneyTreeId'),
                to: Setting.get('readyToAssignId'),
                amount: inflow - outflow,
                createdMonth: timeUtils.getMonthFromDay(createdDay)
            })
        }
        
        return createdTransaction
    }


    undo() {
        if (this.addTransferCmd) this.addTransferCmd.undo()
        super.undo()
    }

    redo() {
        const createdTransaction = super.redo()
        if (this.addTransferCmd) this.addTransferCmd.redo() 
        return createdTransaction
    }


}

export default AddTransaction