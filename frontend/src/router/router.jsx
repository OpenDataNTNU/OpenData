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
import { ImportCkan } from '../pages/ImportCkan';
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
import { Category } from '../pages/Category';
import { EditDescriptionMetadataType } from '../pages/EditDescriptionMetadataType';
import { DCATWizard } from '../pages/DCATWizard';
import { About } from '../pages/About';
import { NewCategory } from '../pages/NewCategory';

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route path="/about" component={About} />
        <PrivateRoute path="/dataType/description/:id" municipality component={EditDescriptionMetadataType} />
        <Route path="/dataType/:typeuuid" component={MetadataByType} />
        <Route path="/dataType/" component={MetadataByType} />
        <Route path="/municipalities/:name" component={MetadataByMunicipality} />
        <Route path="/municipalities" component={MetadataByMunicipality} />
        <Route path="/dataset/:id" component={Inspection} />
        <Route path="/search" component={Search} />
        <Route path="/category/:uuid" component={Category} />
        <Route path="/category" component={Category} />
        <PrivateRoute path="/newCategory" municipality component={NewCategory} />
        <PrivateRoute path="/sendData" municipality component={SendMetadata} />
        <PrivateRoute path="/importCkan" municipality component={ImportCkan} />
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
        <PrivateRoute path="/wizard" municipality component={DCATWizard} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
};
