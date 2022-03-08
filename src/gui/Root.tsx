import * as React from "react"
import * as ReactDOM from 'react-dom'

import { Provider, useSelector, useDispatch } from 'react-redux'

import app from '../app'
import { State } from '../lib/store'


// interface Props {
//   themeId: number;
//   appState: string,
//   dispatch: Function;
//   zoomFactor: number;
// }



function RootComponent() {
  const value = useSelector((state: State) => state.settings.test)
  return (
    <div>
      <h1>hellooo! {value}</h1>
    <h2>Good to see you here.</h2>
  </div>
  )
  
}


ReactDOM.render(
  <Provider store={app().store()}>
    <RootComponent />,
  </Provider>,
  document.getElementById('react-root')
);