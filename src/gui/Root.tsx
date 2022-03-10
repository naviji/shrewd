import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { Provider, useDispatch, useSelector } from 'react-redux'
import app from '../app'
import { setAppState, State } from '../lib/store'
const ipcRenderer = require('electron').ipcRenderer

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
  const status = useSelector((state: State) => state.appState.status)
  const dispatch = useDispatch()

  useEffect(() => {
    async function initializeApp () {
      dispatch(setAppState({ status: 'initializing' }))
      await initialize()
      dispatch(setAppState({ status: 'ready' }))
    }
    if (status === 'starting') {
      initializeApp()
    }
  }, [])

  const handleClick = (e) => {
    console.log('hello')
  }

  return (
    <div>
      <button onClick={handleClick}>Test</button>
      <h1>test43! {status}</h1>
      <h2>Good to see you here.</h2>
    </div>
  )
}

ReactDOM.render(
  <Provider store={app().store()}>
    <RootComponent />,
  </Provider>,
  document.getElementById('react-root')
)
