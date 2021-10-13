import { commands } from "../commands/index.js"

class CommandService {

    constructor() {
        this.instance_ = null
        this.commandMap_ = new Map()
        this.commandHistory_ = []
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

    execute = (cmdName, o) => {
        const commandClass = this.getCommandFromName(cmdName)
        const commandObj = new commandClass()
        const result = commandObj.execute(o)
        this.commandHistory_.push(commandObj)
        return result;
    }

    unexecute = () => {
        const command = this.commandHistory_.pop()
        return command.unexecute(command)
        // return command.unexecute()
    }
}

export default CommandService