import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Url } from './Url';

const Wrapper = styled.div`
  margin: 0.4rem 0px;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
  max-width: 100%;
  box-shadow: 0 0.05rem 0.2rem #d1d1d1;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
  flex: 1;
  background-color: white;
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.p`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const MetadataType = styled.p`

`;

const Important = styled.span`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Urls = styled.div`
  
`;

const FinalizedDataset = ({
  title, distributions, metadataType,
}) => (
  <Wrapper>
    <Content>
      <Info>
        <Title>{ title }</Title>
        <MetadataType>
          <Important>Metadata Type:</Important>
          { ` ${metadataType}` }
        </MetadataType>
        {
            distributions && distributions.length > 0
              ? (
                <p>
                  <Important>Url&apos;s:</Important>
                </p>
              )
              : null
          }
        <Urls>
          {
              distributions && distributions.map(({ format, description, url }) => (
                <Url
                  key={url + description + (Math.random() * (10000))}
                  format={format}
                  description={description}
                  url={url}
                />
              ))
            }
        </Urls>
      </Info>
    </Content>
  </Wrapper>
);

FinalizedDataset.propTypes = {
  title: PropTypes.string.isRequired,
  distributions: PropTypes.arrayOf(PropTypes.shape({
    format: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  metadataType: PropTypes.string.isRequired,
};

export {
  FinalizedDataset,
};
