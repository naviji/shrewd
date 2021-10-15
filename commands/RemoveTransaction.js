import Transaction from "../models/Transaction.js"
import RemoveCommand from "./RemoveCommand.js"

class RemoveTransaction extends RemoveCommand {
    model = () => Transaction
}

export default RemoveTransaction