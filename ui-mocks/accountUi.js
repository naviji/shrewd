import BudgetApplication from '../classes/BudgetApplication.js'
const app = new BudgetApplication()

app.start()
app.addAccount({ accType: "SB", accName: "Axis", createdAt: "today", accId: "Axis123" })
