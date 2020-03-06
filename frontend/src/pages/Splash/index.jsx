import React from 'react';
import { Redirect } from 'react-router-dom';

const Splash = () => { // eslint-disable-line arrow-body-style
  return (
    <Redirect to="/dataType" />
  );
};

export {
  Splash,
};
