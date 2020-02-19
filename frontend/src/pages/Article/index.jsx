import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import parse from 'html-react-parser';

import { Template } from '../../sharedComponents/Template';
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
  margin-bottom: 10px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  flex: 1;
  margin-bottom: 10px;

  & img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const Article = () => {
  // React router dom get id from history
  const { id } = useParams();
  const article = useGetExperienceArticle(id);

  return (
    <Template>
      <Wrapper>
        <Title>{article.title}</Title>
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
          parse(article.body)
        }
        </Body>
      </Wrapper>
    </Template>
  );
};

export {
  Article,
};
