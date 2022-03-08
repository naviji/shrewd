import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider, useSelector, useDispatch } from 'react-redux';

import app from '../app';
import { State, setAppState } from '../lib/store';

const bridge = require('@electron/remote').require('./bridge').default;


// interface Props {
//   themeId: number;
//   appState: string,
//   dispatch: Function;
//   zoomFactor: number;
// }

async function initialize() {
	// Add an event listener to listen for resize window
	// events and send the proper events
}

function RootComponent() {
	const status = useSelector((state: State) => state.appState.status);
	const dispatch = useDispatch();

	React.useEffect(() => {
		async function initializeApp() {
			dispatch(setAppState({ status: 'initializing' }));
			await initialize();
			dispatch(setAppState({ status: 'ready' }));
		}
		if (status === 'starting') {
			initializeApp();
		}
	}, []);

	return (
		<div>
			<h1>hellooo! {status}</h1>
			<h2>Good to see you here.</h2>
		</div>
	);
}

ReactDOM.render(
	<Provider store={app().store()}>
		<RootComponent />,
	</Provider>,
	document.getElementById('react-root')
);
