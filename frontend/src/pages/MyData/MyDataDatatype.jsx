import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MyDataDataset } from './MyDataDataset';

const Wrapper = styled.div`
  max-width: 50em;
  display: flex;
  flex-direction: column;
  border: 1px solid #bbb;
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.5em;
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9em;
  padding: 0.1em 0.7em;
  display: inline-block;
  border-radius: 1em;
  margin: 0.3em;
`;

export const MyDataDatatype = ({ datatype }) => {
  const {
    name, metadataList, description, tags,
  } = datatype;
  const userSelector = useSelector((state) => state.user);
  const { municipalityName } = userSelector.user;
  const otherMunicipalitiesData = metadataList
    .filter((data) => data.municipalityName !== municipalityName);
  return (
    <Wrapper>
      <h2>
        {name}
      </h2>
      <p>
        {description}
      </p>
      <div>
        {tags.map(({ tagName }) => <Tag key={tagName}>{tagName}</Tag>)}
      </div>
      {otherMunicipalitiesData.map((data) => {
        const { uuid } = data;
        return <MyDataDataset key={uuid} data={data} />;
      })}
    </Wrapper>
  );
};


MyDataDatatype.propTypes = {
  datatype: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    metadataList: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      municipalityName: PropTypes.string.isRequired,
    })).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      tagName: PropTypes.string.isRequired,
      metadataTypeName: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
