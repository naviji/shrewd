import * as React from 'react'
import * as ReactDOM from 'react-dom'
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

  React.useEffect(() => {
    async function initializeApp () {
      dispatch(setAppState({ status: 'initializing' }))
      await initialize()
      dispatch(setAppState({ status: 'ready' }))
    }
    if (status === 'starting') {
      initializeApp()
    }
  }, [])

  React.useEffect(() => {
    async function onAppClose () {
      const canClose = true
      // Do some clean up
      ipcRenderer.send('appCloseReply', {
        canClose: canClose
      })
    }
    ipcRenderer.on('appClose', onAppClose)
    return () => {
      ipcRenderer.off('appClose', onAppClose)
    }
  })

  React.useEffect(() => {
    async function env () {
      const envValue = await ipcRenderer.invoke('bridge:env')
      console.log(`envValue = ${envValue}`)
    }
    env()
  })

  const handleClick = (e) => {
    console.log('hello')
  }

  return (
    <div>
      <button onClick={handleClick}>Test</button>
      <h1>testffdfdfdfdfdd33! {status}</h1>
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
