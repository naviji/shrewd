class RemoveCommand {
    constructor() {
        this.oldArgs = null
        this.created = null
    }

    model () {
        throw new Error("Needs to be overriden")
    }
    
    execute (o) {
        this.oldArgs = o
        const { id } = o
        this.created = this.model().getById(id)
        this.model().deleteById(id)
    }

    undo() {
        this.created = this.model().save(this.created)
        return this.created
    }

    redo(options = {}) {
        this.execute(this.oldArgs)
    }
}

export default RemoveCommand