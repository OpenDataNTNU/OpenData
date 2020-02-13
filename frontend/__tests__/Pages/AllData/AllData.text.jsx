import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';

import { AllDataBody } from '../../../src/pages/allData/AllDataBody';

global.fetch = fetch;

const dataTypesResponse = `[
  {
    "name":"Car history",
    "tags":[{
      "tagName":"Public activity",
      "metadataTypeName":"Car history"
    },
    {
      "tagName":"Traffic",
      "metadataTypeName":"Car history"
    }],
    "description":"Wroom wroom",
    "metadataList":[]
  },
  {
    "name":"Cycle history",
    "tags":[{
      "tagName":"Public activity",
      "metadataTypeName":"Cycle history"
    }],
    "description":"Pling pling",
    "metadataList":[]
  }
]`;

describe('Displays all bottom-level datasets with a given name', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });


  it('Shows the title and description of datasets', async () => {
    fetch.mockResponseOnce(dataTypesResponse);
    const {
      findByText, getByText, queryAllByText,
    } = render(
      <AllDataBody />,
    );

    // wait for the data to load
    await findByText(new RegExp('Car history'));
    getByText(new RegExp('Cycle history'));

    // Both car and cycle have the "Public activity" tag, car has the "traffic tag"
    expect(queryAllByText(new RegExp('Traffic')).length).toBe(1);
    expect(queryAllByText(new RegExp('Public activity')).length).toBe(2);

    // should have fetched exactly once
    expect(fetch.mock.calls.length).toEqual(1);
  });
});
