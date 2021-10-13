import { commands } from "../commands/index.js"

class CommandService {

    constructor () {
        this.instance_ = null
        this.commandMap_ = new Map()
    }

    static instance = () => {
        if (this.instance_) return this.instance_
        this.instance_ = new CommandService()
        return this.instance_
    }

    register = (name) => {
        this.commandMap_[name] = commands[name]
    }

    getCommandFromName = (name) => this.commandMap_[name]

    execute = (name) => {
        const commandClass = this.getCommandFromName(name)
        const command = new commandClass()
        return command.execute()
    }
}

export default CommandService