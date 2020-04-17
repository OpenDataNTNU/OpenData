import React from 'react';

import { Provider } from './Context';
import { Wizard } from './Wizard';

const DCATWizard = () => (
  <Provider>
    <Wizard />
  </Provider>
);

export {
  DCATWizard,
};
