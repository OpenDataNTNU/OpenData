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
import { Article } from '../pages/Article';
import { Error404 } from '../pages/Errors';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Logout } from '../pages/Logout';
import { NewExperienceArticle } from '../pages/NewExperienceArticle';
import { MetadataByMunicipality } from '../pages/MetadataByMunicipality';

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route exact path="/viewData" component={AllData} />
        <Route path="/viewData/dataType/:name" component={MetadataByType} />
        <Route path="/viewData/dataset/:id" component={Inspection} />
        <Route path="/sendData" component={SendMetadata} />
        <PrivateRoute path="/articles/new/:id" component={NewExperienceArticle} />
        <PrivateRoute path="/articles/new" component={NewExperienceArticle} />
        <PrivateRoute path="/articles/:id" component={Article} />
        <PrivateRoute path="/login" loggedOut component={Login} />
        <PrivateRoute path="/register" loggedOut component={Register} />
        <PrivateRoute path="/logout" component={Logout} />
        <Route path="/municipalities" component={MetadataByMunicipality} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
};
