import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ReleaseStateLabel } from '../../sharedComponents/Metadata/ReleaseStateLabel';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  padding: 1em;
  margin: 0.5em;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;


export const MyDataDataset = ({ data }) => {
  const {
    municipalityName, uuid, description, releaseState,
  } = data;
  return (
    <Wrapper>
      <HorizontalWrapper>
        <Link to={`/dataset/${uuid}`}>
          {municipalityName}
        </Link>
        <ReleaseStateLabel releaseState={releaseState} />
      </HorizontalWrapper>
      <p>
        {description}
      </p>
    </Wrapper>
  );
};

MyDataDataset.propTypes = {
  data: PropTypes.shape({
    municipalityName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
