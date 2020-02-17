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
import { SendMetadata } from '../pages/sendMetadata/SendMetadata';
import { Error404 } from '../pages/Errors';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Logout } from '../pages/Logout';
import { MunicipalitiesView } from '../pages/MunicipalitiesView';

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route exact path="/viewData" component={AllData} />
        <Route path="/viewData/dataType/:name" component={MetadataByType} />
        <Route path="/viewData/dataset/:id" component={Inspection} />
        <Route path="/sendData" component={SendMetadata} />
        <PrivateRoute path="/login" loggedOut component={Login} />
        <PrivateRoute path="/register" loggedOut component={Register} />
        <PrivateRoute path="/logout" component={Logout} />
        {/* TODO: Use URL params for municipalities and categories */}
        <PrivateRoute path="/municipalities/:municipality/:category" loggedOut component={MunicipalitiesView} />
        <PrivateRoute path="/municipalities/:municipality" loggedOut component={MunicipalitiesView} />
        <PrivateRoute path="/municipalities" loggedOut component={MunicipalitiesView} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
};
