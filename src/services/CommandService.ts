import { commands } from '../commands/index'
import BaseService from './BaseService'

class CommandService extends BaseService {
    private static instance_: CommandService
    private commandMap_: Map<string, any>
    private backwardHistory
    private forwardHistory

    private constructor () {
      super()
      this.commandMap_ = new Map()
      this.backwardHistory = []
      this.forwardHistory = []
    }

    public static instance = () => {
      if (this.instance_) return this.instance_
      this.instance_ = new CommandService()
      return this.instance_
    }

    register = (name) => {
      this.commandMap_[name] = commands[name]
    }

    registerAll = () => {
      for (const name of Object.keys(commands)) {
        this.commandMap_[name] = commands[name]
      }
    }

    getCommandFromName = (name) => this.commandMap_[name]

    execute = (cmdName, o) => {
      const commandClass = this.getCommandFromName(cmdName)
      if (!commandClass) throw new Error(`Command not found: ${cmdName}`)
      const commandObj = new commandClass()
      const result = commandObj.execute(o)
      this.backwardHistory.push(commandObj)
      return result
    }

    undo = () => {
      const command = this.backwardHistory.pop()
      command.undo()
      this.forwardHistory.push(command)
      // return command.unexecute()
    }

    redo = () => {
      const command = this.forwardHistory.pop()
      command.redo()
      this.backwardHistory.push(command)
      // return command.unexecute()
    }
}

export default CommandService
