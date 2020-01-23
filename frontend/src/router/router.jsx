import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Private routes
import PrivateRoute from './PrivateRoute';

// Pages
import { Splash } from '../pages/Splash';

// The app's history object
const history = createBrowserHistory();

const RouterComponent = (props) => {
	return(
		<Router history={history}>
			<Switch>
				<Route exact path="/" component={Splash} />
				<PrivateRoute path="/private" component={()=><h1>Logged in</h1>} />
				<PrivateRoute path="/loggedOut" loggedOut component={()=><h1>Logged out</h1>} />
			</Switch>
		</Router>
	)
}

export {
	RouterComponent as Router,
	history
}