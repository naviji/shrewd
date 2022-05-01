import { configureStore, createSlice } from '@reduxjs/toolkit'
interface AppState {
  status:string
}

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    status: 'starting'
  },
  reducers: {
    setAppState (state : AppState, action) {
      state.status = action.payload.status
    }
  }
})

interface CategoriesState {
  data: CategoriesDataState[]
}

interface CategoriesDataState {
  id: string,
  groupId: string,
  name: string,
  budgeted: number,
  spent: number,
  balance: number
}

export const cateogoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: []
  },
  reducers: {
    setBudgeted (categories: CategoriesState, action) {
      console.log('in set Budgeted', action)
      const { categoryId, budgeted } = action.payload
      const category = categories.data.find(x => x.id === categoryId)
      if (!category) {
        console.log('Cannot find category', categories.data)
      } else {
        category.budgeted = budgeted
      }
    },
    setCategories (categories: CategoriesState, action) {
      console.log('in set categories', action)
      const { categories: newCategories } = action.payload
      categories.data = newCategories
    }
  }
})

// async function generalMiddleware(store: any, next: any, action: any) {
//     console.log("Calling root middlerware with ", action)
//     next(action)
// }

export const { setAppState } = appStateSlice.actions
export const { setBudgeted, setCategories } = cateogoriesSlice.actions

export interface State {
  appState: AppState,
  categories: CategoriesState
}

export default configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    categories: cateogoriesSlice.reducer
  }
})
