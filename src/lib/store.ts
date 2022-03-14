import { configureStore, createSlice } from '@reduxjs/toolkit'
import { CategoryEntity } from '../types/database/types'

// export const categoriesSlice = createSlice({
//     name: 'categories',
//     initialState: {
//         categories: [],
//         selectedCategoryIds:[]
//     },
//     reducers: {
//       select: (state, action) => {
//         state.selectedCategoryIds.push(action.payload)
//       },
//       deselect: (state, action) => {
//         state.selectedCategoryIds = state.selectedCategoryIds.filter(x => x.id !== action.payload)
//       },
//       add: (state, action) => {
//         state.categories.push(action.payload)
//       },
//       remove: (state, action) => {
//         state.categories = state.categories.filter(x => x.id !== action.payload)
//       }
//     }
// })

// export const categoryGroupsSlice = createSlice({
//     name: 'categoryGroups',
//     initialState: {
//         categoryGroups: [],
//         selectedCategoryGroupId: null,
//         collapsedCategoryGroupIds: []
//     },
//     reducers: {
//       select: (state, action) => {
//           // TODO : Select multiple category groups together
//         state.selectedCategoryGroupId = action.payload
//       },
//       deselect: (state) => {
//         state.selectedCategoryGroupId = null
//       },
//       addCollapsed: (state, action) => {
//         state.collapsedCategoryGroupIds.push(action.payload)
//       },
//       removeCollapsed: (state, action) => {
//         state.collapsedCategoryGroupIds = state.collapsedCategoryGroupIds.filter(x => x.id !== action.payload)
//       },
//       add: (state, action) => {
//         state.categoryGroups.push(action.payload)
//       },
//       remove: (state, action) => {
//         state.categoryGroups = state.categoryGroups.filter(x => x.id !== action.payload)
//       }
//     }
// })

// export const viewSlice = createSlice({
//     name: 'view',
//     initialState: {
//         showSideMenu: true,
//         screens: {},
//         syncInProgress: false
//     },
//     reducers: {
//       showSideMenu: (state) => {
//         state.showSideMenu = true
//       },
//       hideSideMenu: (state) => {
//         state.showSideMenu = false
//       },
//       add: (state, action) => {
//         state.screens = Object.assign(state.screens, action.payload)
//       },
//       startSync: (state) => {
//           state.syncInProgress = true
//       },
//       endSync: (state) => {
//         state.syncInProgress = false
//       }
//     }
// })

// export const settingsSlice = createSlice({
//     name: 'settings',
//     initialState: {
//       test: 1
//     },
//     reducers: {
//       set(state, action) {
//         state = Object.assign(state, action.payload)
//       }
//     }
// })

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
