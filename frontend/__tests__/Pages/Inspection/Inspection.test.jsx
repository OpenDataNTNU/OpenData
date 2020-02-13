import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';

import { ViewMetadataBody } from '../../../src/pages/Inspection/ViewMetadataBody';

global.fetch = fetch;

const carHistoryResponse = `{
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
  "metadataList":[{
    "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "url":"https://trondheim.kommune.no",
    "description":"",
    "formatName":"JSON",
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Trondheim"
  },
  {
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afb7",
    "url":"https://bergen.kommune.no",
    "description":"",
    "formatName":"JSON",
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Bergen"
  }]
}`;

const carHistoryTrondheimResponse = `{
  "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "url":"https://trondheim.kommune.no",
  "description":"","formatName":"JSON",
  "releaseState":2,
  "metadataTypeName":"Car history",
  "municipalityName":"Trondheim"
}`;

describe('Page displays bottom-level datasets from municipalities', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });


  it('Shows the title and description of a single dataset', async () => {
    // first fetches metadata about the specific set
    fetch.mockResponseOnce(carHistoryTrondheimResponse);
    // then, when name is specified, fetches more general data about the type
    fetch.mockResponseOnce(carHistoryResponse);
    const {
      getByText, findByText, queryByText,
    } = render(
      <ViewMetadataBody id="" />,
    );

    await findByText(new RegExp('Trondheim'));
    getByText('Wroom wroom');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

    // should have fetched exactly twice, once for fetching municipalities and once for submitting.
    expect(fetch.mock.calls.length).toEqual(2);
  });
});
