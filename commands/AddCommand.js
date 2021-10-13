class AddCommand {
    constructor() {
        this.oldArgs = null
        this.created = null
    }

    model () {
        throw new Error("Needs to be overriden")
    }
    
    execute (o) {
        this.oldArgs = o
        this.created = Object.assign({}, this.model().save(o))
        return this.created;
    }

    undo() {
        this.model().deleteById({id: this.created.id})
        this.created = null
    }

    redo() {
        this.created = Object.assign({}, this.model().save(this.oldArgs))
        return this.created;
    }
}

export default AddCommand