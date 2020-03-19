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
import { MyData } from '../pages/MyData';
import { Search } from '../pages/Search';
import { NewTag } from '../pages/NewTag';
import { Tags } from '../pages/Tags';

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route path="/dataType/:name" component={MetadataByType} />
        <Route path="/dataType/" component={MetadataByType} />
        <Route path="/municipalities/:name" component={MetadataByMunicipality} />
        <Route path="/municipalities" component={MetadataByMunicipality} />
        <Route path="/dataset/:id" component={Inspection} />
        <Route path="/search" component={Search} />
        <PrivateRoute path="/sendData" municipality component={SendMetadata} />
        <PrivateRoute path="/articles/new/:id" municipality component={NewExperienceArticle} />
        <PrivateRoute path="/articles/new" municipality component={NewExperienceArticle} />
        <PrivateRoute path="/articles/:id" component={Article} />
        <PrivateRoute path="/newMetadataType" municipality component={NewMetadataType} />
        <PrivateRoute path="/login" loggedOut component={Login} />
        <PrivateRoute path="/register" loggedOut component={Register} />
        <PrivateRoute path="/logout" component={Logout} />
        <PrivateRoute path="/myData" municipality component={MyData} />
        <PrivateRoute path="/tags/new" municipality component={NewTag} />
        <PrivateRoute path="/tags" municipality component={Tags} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
};
