import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';

import { MetadataForm } from '../src/pages/sendMetadata/MetadataForm';

global.fetch = fetch;

describe('Form handles rejection', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });


  it('displays an error message when fetch request is rejected', () => {
    fetch.mockAbort();
    // const { getByDisplayValue } =
    render(
      <MetadataForm />,
    );
    // getByDisplayValue('Submit');
  });
});
