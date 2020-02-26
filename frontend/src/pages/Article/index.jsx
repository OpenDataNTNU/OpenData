import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import parse from 'html-react-parser';

import { Template } from '../../sharedComponents/Template';
import { CommentSection } from '../../sharedComponents/CommentSection';
import { useGetExperienceArticle } from '../../sharedComponents/hooks';


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

  const comments = {
    1: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 1',
    },
    2: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 2',
      children: {
        21: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 21',
        },
        22: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 22',
          children: {
            221: {
              uuid: '1a',
              author: 'Andreas',
              timestamp: new Date(),
              content: 'This is a comment body 21',
            },
            222: {
              uuid: '1a',
              author: 'Andreas',
              timestamp: new Date(),
              content: 'This is a comment body 22',
            },
          },
        },
        23: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 3',
        },
        24: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 3',
        },
        25: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 3',
        },
        26: {
          uuid: '1a',
          author: 'Andreas',
          timestamp: new Date(),
          content: 'This is a comment body 3',
        },
      },
    },
    3: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 3',
    },
    4: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 3',
    },
    5: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 3',
    },
    6: {
      uuid: '1a',
      author: 'Andreas',
      timestamp: new Date(),
      content: 'This is a comment body 3',
    },
  };

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
        <CommentSection comments={comments} />
      </Wrapper>
    </Template>
  );
};

export {
  Article,
};
