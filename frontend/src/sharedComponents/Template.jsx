import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Header } from './Header';
import { Footer } from './Footer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  min-height: inherit;
`;
const ContentDiv = styled.div`
  flex: 1;
`;

const Template = ({ children }) => (
  <Wrapper>
    <Header />
    <ContentDiv>
      {children}
    </ContentDiv>
    <Footer />
  </Wrapper>
);

Template.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export {
  Template,
};
