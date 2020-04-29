import React from 'react';
import {
  render, wait, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MutationObserver from 'mutation-observer';

import { NewMetadataTypeBody } from '../../../src/pages/NewMetadataType/NewMetadataTypeBody';

global.fetch = fetch;
global.MutationObserver = MutationObserver;


const click = (x) => {
  fireEvent(
    x,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

const inputValue = (targetNode, newValue) => {
  fireEvent.change(
    targetNode,
    { target: { value: newValue } },
  );
};

const tagsResponse = `
  [
    {
      "name": "Public activity"
    },
    {
      "name": "Public property"
    },
    {
      "name": "Traffic"
    }
  ]
`;

const rootCategoryResponse = `
[
  {
    "uuid": "22dfcf90-878d-4f7c-ab18-f24e3e613d77",
    "name": "Organization and cooperation",
    "created": "2020-04-01T08:44:05.877773",
    "lastEdited": "2020-04-01T08:44:05.877773",
    "hasChildren": false,
    "hasTypes": false,
    "parentUuid": null,
    "children": [],
    "types": []
  },
  {
    "uuid": "41d82930-a9e8-4edc-916b-82eb4871be61",
    "name": "Skynet property",
    "created": "2020-04-01T08:44:05.87593",
    "lastEdited": "2020-04-01T08:44:05.87593",
    "hasChildren": true,
    "hasTypes": false,
    "parentUuid": null,
    "children": [
      {
        "uuid": "16bdbbc7-939e-4993-be92-ca9bda7feec2",
        "name": "Terminators",
        "hasChildren": false,
        "children": [],
        "types": []
      }
    ],
    "types": []
  },
  {
    "uuid": "7b1b9d45-ecfb-40e0-81ca-526f2a12f9a8",
    "name": "Travel",
    "created": "2020-04-01T08:44:05.874953",
    "lastEdited": "2020-04-01T08:44:05.874953",
    "hasChildren": true,
    "hasTypes": false,
    "parentUuid": null,
    "children": [
      {
        "uuid": "493e263a-bc30-41c7-b73a-5e3ff5f2ea78",
        "name": "Bikes",
        "hasChildren": false,
        "children": [],
        "types": []
      },
      {
        "uuid": "cf27ff44-536a-4b5b-9d35-17c7bef80047",
        "name": "Cars",
        "hasChildren": false,
        "children": [],
        "types": []
      }
    ],
    "types": []
  }
]
`;

const skynetResponse = `
{
  "uuid": "41d82930-a9e8-4edc-916b-82eb4871be61",
  "name": "Skynet property",
  "created": "2020-04-01T08:44:05.87593",
  "lastEdited": "2020-04-01T08:44:05.87593",
  "hasChildren": true,
  "hasTypes": false,
  "parentUuid": null,
  "children": [
    {
      "uuid": "16bdbbc7-939e-4993-be92-ca9bda7feec2",
      "name": "Terminators",
      "hasChildren": false,
      "children": [],
      "types": []
    }
  ],
  "types": []
}
`;

describe('Provides a form to create metadata types', () => {
  // redux store
  let store;

  // router history
  let history;

  beforeEach(() => {
    fetch.resetMocks();
    const mockStore = configureStore();
    // user should be logged inte tests when seeing this page
    store = mockStore({
      user: {
        user: {
          token: 'abcdef',
          municipalityName: 'Trondheim',
        },
      },
    });
    history = createMemoryHistory();
  });


  it('Renders correctly', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <NewMetadataTypeBody />
        </Router>
      </Provider>,
    );
  });

  it('Can be used to post a new metadata type', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/Tag':
          return tagsResponse;
        case '/api/MetadataCategory':
          return rootCategoryResponse;
        case '/api/MetadataCategory/41d82930-a9e8-4edc-916b-82eb4871be61':
          return skynetResponse;
        default:
          return '';
      }
    });
    history.push('/newMetadataType');
    const {
      findByLabelText, getByPlaceholderText, findByText, getByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <NewMetadataTypeBody />
        </Router>
      </Provider>,
    );
    const tagSelector = getByPlaceholderText(new RegExp('Tags'));
    // options should not be there before the multiselector is clicked
    expect(queryAllByText(new RegExp('Public activity')).length).toEqual(0);
    expect(queryAllByText(new RegExp('Public property')).length).toEqual(0);
    expect(queryAllByText(new RegExp('Public activity')).length).toEqual(0);
    // should be there after the click
    await wait(() => click(tagSelector));
    await findByText(new RegExp('Public activity'));
    const property = getByText(new RegExp('Public property'));
    getByText(new RegExp('Traffic'));
    await wait(() => click(property));
    const nameInput = getByPlaceholderText(new RegExp('Name'));
    const descriptionInput = getByPlaceholderText(new RegExp('Description'));
    await wait(() => inputValue(nameInput, 'This is a test name'));
    await wait(() => inputValue(descriptionInput, 'This is a TeSt desCRIPTION. L0rem ipsum.'));
    // before submission, only the tags and categories should be fetched
    expect(fetch.mock.calls.length).toEqual(2);
    const skynetRadio = await findByLabelText(new RegExp('Skynet property'));
    // Terminators should not be displayed unless skynet is expanded
    expect(queryAllByText(new RegExp('Terminators')).length).toEqual(0);
    // parent element is the label, 2 up is the <li>-tag, where the expand icon is
    const expand = skynetRadio.parentElement.parentElement.querySelector('svg');
    await wait(() => click(expand));
    // Terminators should now have been fetched, and be displayed in the list
    expect(fetch.mock.calls.length).toEqual(3);
    const terminatorsRadio = await findByLabelText(new RegExp('Terminators'));
    await wait(() => click(terminatorsRadio));
    const submitButton = getByText(new RegExp('submit'));
    await wait(() => click(submitButton));
    // should put once for the metadatatype and once for the tag- 3+2=5
    expect(fetch.mock.calls.length).toEqual(4);

    // the body should correspond to what was input in the form
    const metadataBody = fetch.mock.calls[3][1].body;
    expect(JSON.parse(metadataBody)).toEqual({
      categoryUuid: '16bdbbc7-939e-4993-be92-ca9bda7feec2',
      name: 'This is a test name',
    });
    //  TODO: This test is outdated from before description voting was added.
    //   In order to fix this issue and uncomment the following test piece,
    //   fix the fetch mock first.
    //
    //   await new Promise((r) => setTimeout(r, 3000));
    //   expect(history.location.pathname).toEqual('/sendData');
    //
  });
});
