import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Pages
import { Splash } from './pages/Splash';

// The app's history object
const history = createBrowserHistory();

const RouterComponent = (props) => {
    return(
        <Router history={history}>
				<Route
		          render={({ location }) => (
		            <React.Fragment>
		            	<Switch>
					        <Route exact path="/">
                                <Splash />
                            </Route>
					    </Switch>
		            </React.Fragment>
		          )} />
		</Router>
    )
}

export {
	RouterComponent as Router,
	history
}