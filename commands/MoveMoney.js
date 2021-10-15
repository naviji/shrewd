import Transfer from '../models/Transfer.js'
import AddCommand from './AddCommand.js'
import AddTransfer from './AddTransfer.js'

class MoveMoney extends AddCommand {
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