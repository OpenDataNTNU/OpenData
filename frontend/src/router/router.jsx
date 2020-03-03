import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

// History
import { history } from './history';

// Private routes
import PrivateRoute from './PrivateRoute';

// Pages
import { Splash } from '../pages/Splash';
import { MetadataByType } from '../pages/MetadataByType';
import { Inspection } from '../pages/Inspection';
import { Article } from '../pages/Article';
import { SendMetadata } from '../pages/SendMetadata';
import { NewMetadataType } from '../pages/NewMetadataType';
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
        <Route path="/dataType/:name" component={MetadataByType} />
        <Route path="/dataset/:id" component={Inspection} />
        <PrivateRoute path="/sendData" municipality component={SendMetadata} />
        <PrivateRoute path="/articles/new/:id" municipality component={NewExperienceArticle} />
        <PrivateRoute path="/articles/new" municipality component={NewExperienceArticle} />
        <PrivateRoute path="/articles/:id" component={Article} />
        <PrivateRoute path="/newMetadataType" municipality component={NewMetadataType} />
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
