import React from 'react';
import styled, { keyframes } from 'styled-components';

import { Template } from '../../sharedComponents/Template';
import logo from '../../assets/logo.svg';
import { AllDataBody } from '../allData/AllDataBody';

const Splash = () => { // eslint-disable-line arrow-body-style
  return (
    <Template>
      <AllDataBody />
    </Template>
  );
};

export {
  Splash,
};
