import { configureStore, createSlice } from '@reduxjs/toolkit'

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
import { nanoid } from 'nanoid'

const groupIds = [nanoid(), nanoid()]

const data = [
  {
    id: nanoid(),
    groupId: groupIds[0],
    name: 'Audible',
    budgeted: 123400,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: groupIds[0],
    name: 'Internet',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: groupIds[1],
    name: 'Playstation',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  },
  {
    id: nanoid(),
    groupId: groupIds[1],
    name: 'iphone',
    budgeted: 112345600,
    spent: 112345600,
    balance: 112345600
  }
]

export const appStateSlice = createSlice({
  name: 'appState',
  initialState: {
    status: 'starting'
  },
  reducers: {
    setAppState (state, action) {
      state.status = action.payload.status
    }
  }
})

export const cateogoriesSlice = createSlice({
  name: 'categories',
  initialState: data,
  reducers: {
    setBudgeted (categories, action) {
      console.log('in set Budgeted', action)
      const { categoryId, budgeted } = action.payload
      const category = categories.find(x => x.id === categoryId)
      category.budgeted = budgeted
    }
  }
})

// async function generalMiddleware(store: any, next: any, action: any) {
//     console.log("Calling root middlerware with ", action)
//     next(action)
// }

export const { setAppState } = appStateSlice.actions
export const { setBudgeted } = cateogoriesSlice.actions

export interface State {
  status: String,
  categories: any[]
}

export default configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    categories: cateogoriesSlice.reducer
  }
})
