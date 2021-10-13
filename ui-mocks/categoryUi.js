import BudgetApplication from '../classes/BudgetApplication.js'
const app = new BudgetApplication()

app.start()
app.addCategory({ groupId: "Tour", createdAt: "today", catName: "Goa", catId: "Goa" })
