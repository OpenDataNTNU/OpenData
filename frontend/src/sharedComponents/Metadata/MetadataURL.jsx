import React from 'react';
import styled from 'styled-components';
import { Link as LinkIcon } from 'styled-icons/icomoon/Link';
import PropTypes from 'prop-types';

const MetadataURLContainer = styled.a`
  display: flex;
  background-color: #d8e3ff;
  font-size: 0.9rem;
  color: #434faf;
  margin: 0;
  min-height: 2.0rem;
  align-content: center;
  align-items: center;
  border: ${(props) => (props.inspection ? 'solid 0.1rem #434faf' : 'none')}; 
  border-radius: ${(props) => (props.inspection ? '0.2rem' : '0')}; 
`;
const UrlPart = styled.p`
  font-size: inherit;
  flex: 1;
  margin: 0 0 0 0.5rem;
  padding: 0;
`;
const URL = styled.p`
`;
const DataFormat = styled.p`
  margin: 0 0 0 0.4rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.8rem;
  border: solid 0.1rem #434faf;
  border-radius: 0.3rem;
`;
const LinkIconStyled = styled(LinkIcon)`
  height: 1.3rem;
  margin-right: 1.0rem;
  color: #434faf
`;


const MetadataURL = ({
  url, formatName, inspection, startDate, endDate,
}) => (
  <MetadataURLContainer href={url} target="_blank" inspection={inspection}>
    <DataFormat>{formatName}</DataFormat>
    <UrlPart>
      <URL>{url}</URL>
      {
        typeof startDate !== 'undefined' && typeof endDate !== 'undefined' ? (
          <p>
            <b>
              From
              {startDate}
              {' '}
              to
              {endDate}
            </b>
          </p>
        ) : null
      }
    </UrlPart>
    <LinkIconStyled />
  </MetadataURLContainer>
);

MetadataURL.propTypes = {
  url: PropTypes.string.isRequired,
  formatName: PropTypes.string.isRequired,
  inspection: PropTypes.bool,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};
MetadataURL.defaultProps = {
  inspection: false,
};
export {
  MetadataURL,
};
