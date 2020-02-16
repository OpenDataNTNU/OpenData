import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

// History
import { history } from './history';

// Private routes
import PrivateRoute from './PrivateRoute';

// Pages
import { Splash } from '../pages/Splash';
import { AllData } from '../pages/allData';
import { MetadataByType } from '../pages/MetadataByType';
import { Inspection } from '../pages/Inspection';
import { SendMetadata } from '../pages/SendMetadata';
import { NewMetadataType } from '../pages/NewMetadataType';
import { Error404 } from '../pages/Errors';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Logout } from '../pages/Logout';

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route exact path="/viewData" component={AllData} />
        <Route path="/viewData/dataType/:name" component={MetadataByType} />
        <Route path="/viewData/dataset/:id" component={Inspection} />
        <Route path="/sendData" component={SendMetadata} />
        <Route path="/newMetadataType" component={NewMetadataType} />
        <PrivateRoute path="/login" loggedOut component={Login} />
        <PrivateRoute path="/register" loggedOut component={Register} />
        <PrivateRoute path="/logout" component={Logout} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
};
