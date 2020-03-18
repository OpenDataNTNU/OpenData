import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Enlarge2 } from 'styled-icons/icomoon/Enlarge2';
import { Shrink2 } from 'styled-icons/icomoon/Shrink2';
import { ContentCollapsed, ContentExpanded } from './ContentComps';

const SingleMetaDataResultContainer = styled.div`
  margin: 0.4rem 0.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
  max-width: 100%;
  box-shadow: 0 0.05rem 0.20rem #d1d1d1; 
`;

const ExpansionBar = styled.div`
  background-color: #F7F9FA;
  border-right: solid 0.1rem #dfe1e2;
`;
const ExpansionButton = styled.button`
  margin: 0;
  padding: 0.3rem;
  border: none;
  background: none;
  display: block;
  cursor: pointer;
`;
const ExpandIcon = styled(Enlarge2)`
  width: 0.9rem;
  height: 0.9rem;
  color: dimgray;
`;
const CollapseIcon = styled(Shrink2)`
  width: 0.9rem;
  height: 0.9rem;
  color: dimgray;
`;

const SingleMetaDataResult = ({
  metadata, showCategory, showMunicipality, expanded,
}) => {
  const [expandedState, setExpandedState] = useState(expanded);
  const handleExpansion = () => {
    setExpandedState(!expandedState);
  };
  return (
    <SingleMetaDataResultContainer>
      <ExpansionBar>
        <ExpansionButton onClick={handleExpansion}>
          { expanded ? <CollapseIcon /> : <ExpandIcon /> }
        </ExpansionButton>
      </ExpansionBar>
      { expandedState
        ? (
          <ContentExpanded
            metadata={metadata}
            showCategory={showCategory}
            showMunicipality={showMunicipality}
          />
        )
        : (
          <ContentCollapsed
            metadata={metadata}
            showCategory={showCategory}
            showMunicipality={showMunicipality}
          />
        )}
    </SingleMetaDataResultContainer>
  );
};

SingleMetaDataResult.propTypes = {
  metadata: PropTypes.shape({
    uuid: PropTypes.string,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    municipalityName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    dataSource: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        dataFormat: PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          documentationUrl: PropTypes.string.isRequired,
        }),
        startDate: PropTypes.string,
        endDate: PropTypes.string,
      }),
    ).isRequired,
    experiencePosts: PropTypes.arrayOf(PropTypes.shape({
      experiencePostUuid: PropTypes.string.isRequired,
      metadataUuid: PropTypes.string.isRequired,
    })),
  }).isRequired,
  showCategory: PropTypes.bool,
  showMunicipality: PropTypes.bool,
  expanded: PropTypes.bool,
};
SingleMetaDataResult.defaultProps = {
  showCategory: false,
  showMunicipality: false,
  expanded: false,
};
export {
  SingleMetaDataResult,
};
