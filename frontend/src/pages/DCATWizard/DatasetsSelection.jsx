import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Dataset } from './Dataset';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LoadMoreButton = styled.button`
  padding: 0.3em;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: .875rem;
  line-height: 2.25rem;
  font-weight: 500;
  letter-spacing: .0892857143em;
  text-decoration: none;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em 0;
  cursor: pointer;
  position: relative;
`;

const Selection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Datasets = styled.div`
  overflow: auto;
  flex: 1;
`;

const SelectButton = styled.button`

`;

const DatasetsSelection = ({ state: { datasets, selections }, setState }) => {
  console.log(datasets)
  const [showCount, setShowCount] = useState(10);
  const reducedDatasets = datasets ? datasets.slice(0, showCount) : [];

  const onClick = () => {
    setShowCount(showCount + Math.min(10, datasets.length - showCount));
  }

  const onSelection = (index) => {
    const newSelections = [...selections.slice(0, index), !selections[index], ...selections.slice(index+1)]
    setState({
      datasets: datasets,
      selections: newSelections
    })
  };

  const onSelectAll = () => {
    const newSelections = new Array(datasets.length).fill(true)
    setState({
      datasets: datasets,
      selections: newSelections
    });
  }

  const onDeselectAll = () => {
    const newSelections = new Array(datasets.length).fill(false)
    setState({
      datasets: datasets,
      selections: newSelections
    });
  }

  return(
    <Wrapper>
      <Selection>
        <span>Datasets to import:</span>
        <div>
          <SelectButton onClick={onSelectAll}>Select All</SelectButton>
          <SelectButton onClick={onDeselectAll}>Deselect All</SelectButton>
        </div>
      </Selection>
      <Datasets>
        {
          reducedDatasets && reducedDatasets.map(({ title, distributions }, index) => (
            <Dataset key={title} selected={selections[index]} onSelection={onSelection} index={index} title={title} distributions={distributions} />
          ))
        }
      </Datasets>
      <LoadMoreButton onClick={onClick}> Load more ({datasets.length - showCount}) </LoadMoreButton>
    </Wrapper>
  );
};

DatasetsSelection.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.string),
};

export {
  DatasetsSelection,
};
