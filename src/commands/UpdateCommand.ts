class UpdateCommand {
    private oldState
    private newState

    constructor() {
        this.oldState = null
        this.newState = null
    }

    model (): any { // TODO FIX any
        throw new Error("Needs to be overriden")
    }
    
    execute (o) {
        const { id } = o
        if (!id) {
            throw new Error("Update must have ID")
        }
        
        this.oldState = Object.assign({}, this.model().getById(id))
        this.newState = Object.assign({}, this.model().save(o))
        return this.newState;
    }

    undo() {
        const temp = Object.assign({}, this.model().save(this.oldState))
        this.oldState = this.newState
        this.newState = temp
    }

    redo() {
        this.undo()
    }
}

export default UpdateCommand