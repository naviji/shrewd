import Transaction from "../models/Transaction"
import RemoveCommand from "./RemoveCommand"

class RemoveTransaction extends RemoveCommand {
    model = () => Transaction
}

export default RemoveTransaction