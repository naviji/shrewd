import BudgetApplication from './classes/BudgetApplication.js'

const app = new BudgetApplication()

app.start()
app.addAccount({accType: "Savings", name: "Axis"})
app.addCategoryGroup()
app.addCategory()

