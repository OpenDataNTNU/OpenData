import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRightS } from 'styled-icons/remix-fill/ArrowRightS';

import { Template } from '../../sharedComponents/Template';
import { useGetTags } from '../../sharedComponents/hooks/GetTags';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-around;
  max-width: 30em;
  min-width: 20em;
  padding: 1em;
  margin: 10px 0px;
  background-color: white;
  border-radius: 4px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const TagsLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  margin-bottom: 10px;
`;

const List = styled.div`
  overflow: auto;
`;

const Tag = styled.div`
  &:not(:last-child) {
    margin-bottom: 10px;
    padding-bottom: 2px;
    border-bottom: 1px solid lightgray;
  }
`;

const Tags = () => {
  // State
  const allTags = useGetTags() || [];

  return (
    <Template>
      <Wrapper>
        <Contents>
          <TagsLink to="/tags/new">
            <span>New Tag</span>
            <ArrowRightS size="1em" />
          </TagsLink>
          <List>
            {
              allTags.map((tag) => (
                <Tag key={tag}>
                  {tag}
                </Tag>
              ))
            }
          </List>
        </Contents>
      </Wrapper>
    </Template>
  );
};

export {
  Tags,
};
