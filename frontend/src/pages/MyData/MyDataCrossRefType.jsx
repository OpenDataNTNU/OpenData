import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.2rem solid #e6e6e6;
  border-radius: 0.3rem;
  padding: 0.5rem;
  margin: 0.5rem;
  color: #272727;
  & h3 {
    margin: 0.5rem 0;
  }
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9rem;
  padding: 0.1rem 0.7rem;
  display: inline-block;
  border-radius: 1rem;
  margin: 0.3rem;
`;

const MyDataCrossRefType = ({ datatype }) => {
  const {
    name, metadataList, description, tags,
  } = datatype;
  const userSelector = useSelector((state) => state.user);
  const { municipalityName } = userSelector.user;
  const otherMunicipalitiesData = metadataList
    .filter((data) => data.municipalityName !== municipalityName);
  return (
    <Wrapper>
      <h3>
        {name}
      </h3>
      <p>
        {description}
      </p>
      <div>
        {tags.map(({ tagName }) => <Tag key={tagName}>{tagName}</Tag>)}
      </div>
      {otherMunicipalitiesData.map((data) => {
        const { uuid } = data;
        return <SingleMetaDataResult key={uuid} metadata={data} showMunicipality showCategory />;
      })}
    </Wrapper>
  );
};


MyDataCrossRefType.propTypes = {
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

export {
  MyDataCrossRefType,
};
