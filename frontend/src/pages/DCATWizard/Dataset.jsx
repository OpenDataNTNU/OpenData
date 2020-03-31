import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Url } from './Url';

const Wrapper = styled.div`
  margin: 0.8rem 0px;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
  max-width: 100%;
  box-shadow: 0 0.05rem 0.2rem #d1d1d1;
`;

const SelectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F7F9FA;
  border-right: solid 0.1rem #dfe1e2;
`;

const Content = styled.div`
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
  flex: 1;
  background-color: white;
`;

const Title = styled.p`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Urls = styled.div`
  
`;

const Dataset = ({
  selected, onSelection, id, title, distributions,
}) => {
  const onChange = () => {
    onSelection(id);
  };

  return (
    <Wrapper>
      <SelectionWrapper>
        <input type="checkbox" checked={selected} onChange={onChange} />
      </SelectionWrapper>
      <Content>
        <Title>{ title }</Title>
        {
          distributions && distributions.length > 0
           ? (
            <p>
              Urls:
            </p>
           )
           : null
        }
        <Urls>
          {
            distributions && distributions.map(({ format, description, url }) => (
              <Url
                key={url + description}
                format={format}
                description={description}
                url={url}
              />
            ))
          }
        </Urls>
      </Content>
    </Wrapper>
  );
};

Dataset.propTypes = {
  selected: PropTypes.bool.isRequired,
  onSelection: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  distributions: PropTypes.shape({
    format: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export {
  Dataset,
};
