import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { CommentSection } from '../../src/sharedComponents/CommentSection';

global.fetch = fetch;

describe('Comment Section', () => {
  // mock store and history
  let store;
  let history;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore([thunk]);
    // Initialize mockstore with empty state
    const initialEmptyState = {
      user: {
        loggedIn: true,
        user: {
          mail: 'andreasjj@asker.kommune.no',
          userType: 1,
          municipalityName: 'Asker',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlYXNqakBhc2tlci5rb21tdW5lLm5vIiwidW5pcXVlX25hbWUiOiJhbmRyZWFzampAYXNrZXIua29tbXVuZS5ubyIsIm5iZiI6MTU4MzM1MjQyOSwiZXhwIjoxNTgzNjExNjI5LCJpYXQiOjE1ODMzNTI0Mjl9.da16a2nnF4GD0FNQPD_KPlEdLRCM-GWfRfXDBLUxkss',
        },
      },
    };
    store = mockStore(initialEmptyState);
    history = createMemoryHistory();
  });

  const comments = [
    {
      uuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: 'Comment',
      published: '2020-03-04T20:09:36',
      edited: '2020-03-04T20:09:36',
      hasChildren: true,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [
        {
          uuid: '08d7c07a-8fb5-47cd-824b-cc72ef53ec2f',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: 'Reply',
          published: '2020-03-04T20:28:18.626938',
          edited: '2020-03-04T20:28:18.626938',
          hasChildren: true,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [
            {
              uuid: '08d7c07a-9341-45f2-8a8c-6d44c650cf17',
              userMail: 'andreasjj@asker.kommune.no',
              user: null,
              content: 'Reply',
              published: '2020-03-04T20:28:22.873752',
              edited: '2020-03-04T20:28:22.873752',
              hasChildren: true,
              parentCommentUuid: '08d7c07a-8fb5-47cd-824b-cc72ef53ec2f',
              childComments: [
                {
                  uuid: '08d7c07a-95cb-4584-8dbc-d8b1a92fd957',
                  userMail: 'andreasjj@asker.kommune.no',
                  user: null,
                  content: 'Reply',
                  published: '2020-03-04T20:28:27.105481',
                  edited: '2020-03-04T20:28:27.105481',
                  hasChildren: true,
                  parentCommentUuid: '08d7c07a-9341-45f2-8a8c-6d44c650cf17',
                  childComments: [
                    {
                      uuid: '08d7c07a-9858-4c23-8243-a02bea0552ff',
                      userMail: 'andreasjj@asker.kommune.no',
                      user: null,
                      content: 'This should be found 1',
                      published: '2020-03-04T20:28:36.061087',
                      edited: '2020-03-04T20:28:36.061087',
                      hasChildren: true,
                      parentCommentUuid: '08d7c07a-95cb-4584-8dbc-d8b1a92fd957',
                      childComments: [
                        {
                          uuid: '08d7c07a-9858-4c23-8243-a02bea0552ff',
                          userMail: 'andreasjj@asker.kommune.no',
                          user: null,
                          content: 'Hidden',
                          published: '2020-03-04T20:28:36.061087',
                          edited: '2020-03-04T20:28:36.061087',
                          hasChildren: true,
                          parentCommentUuid: '08d7c07a-95cb-4584-8dbc-d8b1a92fd957',
                          childComments: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          uuid: '08d7c07c-9e2f-4815-8922-e4af2bb586c6',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: '2. comment',
          published: '2020-03-04T20:42:55.975146',
          edited: '2020-03-04T20:42:55.975146',
          hasChildren: false,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [],
        },
        {
          uuid: '08d7c07d-04cc-4220-8ea1-fb17eafcfe1f',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: '3. comment',
          published: '2020-03-04T20:45:48.069426',
          edited: '2020-03-04T20:45:48.069426',
          hasChildren: false,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [],
        },
        {
          uuid: '08d7c07d-1874-41f3-8895-b1b837142375',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: '4. comment',
          published: '2020-03-04T20:46:21.026193',
          edited: '2020-03-04T20:46:21.026193',
          hasChildren: false,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [],
        },
        {
          uuid: '08d7c07d-d072-48b5-8f6a-be069f885776',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: '5. comment',
          published: '2020-03-04T20:51:29.730268',
          edited: '2020-03-04T20:51:29.730268',
          hasChildren: false,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [],
        },
        {
          uuid: '08d7c07d-d4cb-4279-8402-a3513a9765d7',
          userMail: 'andreasjj@asker.kommune.no',
          user: null,
          content: '6. comment',
          published: '2020-03-04T20:51:37.003913',
          edited: '2020-03-04T20:51:37.003913',
          hasChildren: false,
          parentCommentUuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          childComments: [],
        },
      ],
    },
    {
      uuid: '08d7c07c-a24d-4f95-8138-c0ea3847e04f',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: '2. Comment',
      published: '2020-03-04T20:43:02.87341',
      edited: '2020-03-04T20:43:02.87341',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
    {
      uuid: '08d7c07c-a4a8-4639-8c6f-4ba2106ebffa',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: '3. Comment',
      published: '2020-03-04T20:43:06.757714',
      edited: '2020-03-04T20:43:06.757714',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
    {
      uuid: '08d7c07c-fae3-4cb7-83e2-2a6e6b98dc2d',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: '4. comment',
      published: '2020-03-04T20:45:31.428541',
      edited: '2020-03-04T20:45:31.428541',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
    {
      uuid: '08d7c07c-fd73-4b42-8e28-5dd2ca4f4fbb',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: '5. comment',
      published: '2020-03-04T20:45:35.765271',
      edited: '2020-03-04T20:45:35.765271',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
    {
      uuid: '08d7c07d-0089-4234-80f5-2338a2395587',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: '6. comment',
      published: '2020-03-04T20:45:40.898513',
      edited: '2020-03-04T20:45:40.898513',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
    {
      uuid: '08d7c07d-1cab-40f8-88ff-111b545a3aab',
      userMail: 'andreasjj@asker.kommune.no',
      user: null,
      content: 'This should be found 2',
      published: '2020-03-04T20:46:28.102221',
      edited: '2020-03-04T20:46:28.102221',
      hasChildren: false,
      parentCommentUuid: '00000000-0000-0000-0000-000000000000',
      childComments: [],
    },
  ];

  it('should render comments, but hide the ones with a limit', async () => {
    fetch.mockResponse(JSON.stringify(comments));

    let GetByText;
    let QueryByText;
    await wait(() => {
      const { getByText, queryByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <CommentSection
              putUrl="/api/Comment/experiencepost/08d7c077-ad22-4768-84d8-ce4205e797fc"
              getUrl="/api/Comment/experiencepost/08d7c077-ad22-4768-84d8-ce4205e797fc"
            />
          </Router>
        </Provider>,
      );
      GetByText = getByText;
      QueryByText = queryByText;
    });

    const first = GetByText('This should be found 1');
    const second = GetByText('This should be found 2');
    const hidden = QueryByText('Hidden');

    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
    expect(hidden).not.toBeInTheDocument();
  });
});
