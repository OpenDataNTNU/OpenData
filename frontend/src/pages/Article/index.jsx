import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import parse from 'html-react-parser';

import { Template } from '../../sharedComponents/Template';
import { CommentSection } from '../../sharedComponents/CommentSection';
import { useGetExperienceArticle } from '../../sharedComponents/hooks';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 960px;
  margin: auto;
  box-sizing: border-box;
  @media screen and (max-width: 960px) {
    padding: 5px;
  }
`;

const Title = styled.h2`
  margin-bottom: 5px;
`;

const Tags = styled.p`
  display: flex;
  opacity: 60%;
  margin: 5px 0px 10px 0px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  flex: 1;
  margin-bottom: 10px;
  padding: 15px 0px;
  border-top: 1px solid black;

  & img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const Article = () => {
  // React router dom get id from history
  const { id } = useParams();
  const article = useGetExperienceArticle(id) || {};
  const [comments_, setComments_] = useState([]);

  useEffect(() => {
    const init = async () => {
      await getComments();
    }
    init();
  });

  const getComments = async () => {
    try {
      const response = fetch(putUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });

      if (response.ok && response.status === 200) {
        const _comments = (await response).json();
        setCommments_(_comments);
      } else {
        throw new Error();
      }
    } catch (_) {
      dispatch(alertActions.error('Failed to load comments.'));
    }
  }

  const comments = [
    {
      uuid: '1',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
    {
      uuid: '2',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: [
        {
          uuid: '21',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: null,
        },
        {
          uuid: '22',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: [
            {
              uuid: '221',
              content: 'Test comment!',
              usermail: 'test@test.kommune.no',
              user: null,
              parentcommentuuid: '22',
              parentcomment: null,
              published: new Date(),
              edited: false,
              childcomments: null,
            },
            {
              uuid: '222',
              content: 'Test comment!',
              usermail: 'test@test.kommune.no',
              user: null,
              parentcommentuuid: '22',
              parentcomment: null,
              published: new Date(),
              edited: false,
              childcomments: [
                {
                  uuid: '2221',
                  content: 'Test comment!',
                  usermail: 'test@test.kommune.no',
                  user: null,
                  parentcommentuuid: '222',
                  parentcomment: null,
                  published: new Date(),
                  edited: false,
                  childcomments: [
                    {
                      uuid: '22211',
                      content: 'Test comment!',
                      usermail: 'test@test.kommune.no',
                      user: null,
                      parentcommentuuid: '2221',
                      parentcomment: null,
                      published: new Date(),
                      edited: false,
                      childcomments: [
                        {
                          uuid: '222111',
                          content: 'Test comment!',
                          usermail: 'test@test.kommune.no',
                          user: null,
                          parentcommentuuid: '22211',
                          parentcomment: null,
                          published: new Date(),
                          edited: false,
                          childcomments: null,
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
          uuid: '23',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: null,
        },
        {
          uuid: '24',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: null,
        },
        {
          uuid: '25',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: null,
        },
        {
          uuid: '26',
          content: 'Test comment!',
          usermail: 'test@test.kommune.no',
          user: null,
          parentcommentuuid: '2',
          parentcomment: null,
          published: new Date(),
          edited: false,
          childcomments: null,
        },
      ],
    },
    {
      uuid: '3',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
    {
      uuid: '4',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
    {
      uuid: '5',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
    {
      uuid: '6',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
    {
      uuid: '7',
      content: 'Test comment!',
      usermail: 'test@test.kommune.no',
      user: null,
      parentcommentuuid: null,
      parentcomment: null,
      published: new Date(),
      edited: false,
      childcomments: null,
    },
  ];

  return (
    <Template>
      <Wrapper>
        <Title>{article.title || ''}</Title>
        <Tags>
          {
            article.tags && article.tags.map((tag, index) => {
              if (index + 1 === article.tags.length) {
                return `${tag.tagName}`;
              }
              return `${tag.tagName}, `;
            })
          }
        </Tags>
        <Body>
          {
            parse(article.contents || '')
          }
        </Body>
        <CommentSection id={id} comments={comments} />
      </Wrapper>
    </Template>
  );
};

export {
  Article,
};
