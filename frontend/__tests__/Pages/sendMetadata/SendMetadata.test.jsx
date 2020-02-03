import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';

import { MetadataForm } from '../../../src/pages/sendMetadata/MetadataForm';

global.fetch = fetch;

const click = (x) => {
  fireEvent(
    x,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

describe('Form handles rejection', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });


  it('displays an error message when fetch request is rejected', async () => {
    fetch.mockResponseOnce(JSON.stringify({ municipalities: [{ name: 'Trondheim' }, { name: 'Oslo' }] }));
    const { getByText, queryByText } = render(
      <MetadataForm />,
    );
    // initially should have no error message
    expect(queryByText('Noe gikk galt')).toBeNull();
    fetch.mockAbort();
    await wait(() => click(getByText('Submit')));
    // should give you an error
    getByText('Noe gikk galt');
    // should have fetched exactly twice, once for fetching municipalities and once for submitting.
    expect(fetch.mock.calls.length).toEqual(2);
  });

  it('Succeeds when the fetch request goes well', async () => {
    // update this when API-call format is clarified
    fetch.mockResponse(JSON.stringify({ status: 'ok' }));
    const { getByText, queryByText } = render(
      <MetadataForm />,
    );

    // click the submit button
    await wait(() => click(getByText('Submit')));
    expect(queryByText('Noe gikk galt')).toBeNull();
    getByText('Metadata ble sendt!');
    // should have fetched exactly twice, once for fetching municipalities and once for submitting.
    expect(fetch.mock.calls.length).toEqual(2);
  });
});
