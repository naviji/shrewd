import BudgetApplication from '../classes/BudgetApplication.js'
const app = new BudgetApplication()

app.start()
app.addCategoryGroup({ groupName: "Tour", groupId: "Tour", createdAt: "today" })
