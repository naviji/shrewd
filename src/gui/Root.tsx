import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import app from '../app'
import ErrorBoundary from './ErrorBoundary'
import { setAppState, State } from '../lib/store'

import Button from '@mui/material/Button'
import Dashboard from './Dashboard'

import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// interface Props {
//   themeId: number;
//   appState: string,
//   dispatch: Function;
//   zoomFactor: number;
// }

async function initialize () {
  // Add an event listener to listen for resize window
  // events and send the proper events
}

function RootComponent () {
  // const status = useSelector((state: State) => state.appState.status)
  // const dispatch = useDispatch()

  useEffect(() => {
    async function initializeApp () {
      await initialize()
    }
    initializeApp()
  }, [])

  return (
      <Dashboard />
  )
}

const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff'
    },
    secondary: {
      main: '#014ede'
    },
    background: {
      default: '#f1f1f1'
    }
  }
})

ReactDOM.render(
  <ThemeProvider theme={mdTheme}>
  <Provider store={app().store()}>
      <ErrorBoundary>
        <RootComponent />
      </ErrorBoundary>
  </Provider>
  </ThemeProvider>,
  document.getElementById('react-root')
)
