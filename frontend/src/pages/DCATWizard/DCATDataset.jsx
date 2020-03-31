import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dataset } from './Dataset';

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

const Datasets = styled.div`
  
`;

const DCATDataset = ({
  selections, onSelection, title, distributions,
}) => {
  const onChange = () => {
    const newSelections = new Array(selections.length).fill(!selections.every(Boolean));
    onSelection(title, newSelections);
  };

  const onSingleSelect = (index) => {
    const newSelections = Array.from(selections);
    newSelections[index] = !newSelections[index];
    onSelection(title, newSelections);
  };

  return (
    <Wrapper>
      <SelectionWrapper>
        <input type="checkbox" checked={selections.every(Boolean)} onChange={onChange} />
      </SelectionWrapper>
      <Content>
        <Title>{ title }</Title>
        <Datasets>
          {
            distributions && distributions.map(({ format, description, url }, index) => (
              <Dataset
                key={url + description}
                index={index}
                selected={selections[index]}
                onSelect={onSingleSelect}
                format={format}
                description={description}
                url={url}
                showSelect={false}
              />
            ))
          }
        </Datasets>
      </Content>
    </Wrapper>
  );
};

DCATDataset.propTypes = {
  selections: PropTypes.arrayOf(PropTypes.bool).isRequired,
  onSelection: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  distributions: PropTypes.shape({
    format: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export {
  DCATDataset,
};
