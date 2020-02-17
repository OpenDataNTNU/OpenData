import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Header } from './Header';
import { Footer } from './Footer';
import { SubHeader } from './SubHeader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  min-height: inherit;
`;

const Template = ({ children }) => (
  <Wrapper>
    <Header />
    <SubHeader/>
    {children}
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
