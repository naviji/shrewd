import BaseModel from "../models/BaseModel"

class AddCommand {

    private oldArgs
    private created

    constructor() {
        this.oldArgs = null
        this.created = null
    }

    model () : any { // to fix any
        throw new Error("Needs to be overriden")
    }
    
    execute (o) {
        this.oldArgs = o
        this.created = Object.assign({}, this.model().save(o))
        return this.created;
    }

    undo() {
        this.model().deleteById(this.created.id)
        this.created = null
    }

    redo(options = {}) {
        this.created = Object.assign({}, this.model().save(Object.assign({}, this.oldArgs, options)))
        return this.created;
    }
}

export default AddCommand