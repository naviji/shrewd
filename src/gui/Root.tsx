import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import app from '../app'
import { setAppState, State } from '../lib/store'

// https:// stackoverflow.com/questions/18091724/search-path-for-typescript-d-ts-files
/// <reference path="./references.ts" />

// const bridge = require('@electron/remote').require('./bridge').default

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

  // React.useEffect(() => {
  //   async function initializeApp () {
  //     dispatch(setAppState({ status: 'initializing' }))
  //     await initialize()
  //     window.electronAPI.onAppClose((event) => {
  //       // do some clean up
  //       event.reply('appCloseReply', { canClose: true })
  //     })

  //     dispatch(setAppState({ status: 'ready' }))
  //   }
  //   if (status === 'starting') {
  //     initializeApp()
  //   }
  // }, [])

  const handleClick = (e) => {
    console.log('hello')
  }

  return (
    <div>
      <button onClick={handleClick}>Test</button>
      <h1>testffdd33! {status}</h1>
      <h2>Good to see you here.</h2>
    </div>
  )
}

ReactDOM.render(
  // <Provider store={app().store()}>
    <RootComponent />,
    // </Provider>,
    document.getElementById('react-root')
)
