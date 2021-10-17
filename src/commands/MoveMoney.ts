import Transfer from '../models/Transfer'
import AddCommand from './AddCommand'
import AddTransfer from './AddTransfer'

class MoveMoney extends AddCommand {
    private fromMove
    private toMove
    
    model = () => Transfer


    constructor() {
        super()
        this.fromMove = new AddTransfer()
        this.toMove = new AddTransfer()
    }

    execute = (o) => {
        const {from, to, amount} = o
        const t1 = this.fromMove.execute({categoryId: from, amount: -amount})
        const t2 = this.toMove.execute({categoryId: to, amount: amount})
        return t2
    }

    undo = () => {
        this.toMove.undo()
        this.fromMove.undo()
    }

    redo = () => {
        this.fromMove.redo()
        this.toMove.redo()
    }
}

export default MoveMoney