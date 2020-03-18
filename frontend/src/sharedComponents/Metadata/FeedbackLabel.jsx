import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Checkmark } from 'styled-icons/icomoon/Checkmark';
import { Cross } from 'styled-icons/icomoon/Cross';

const FeedbackLabelContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  float: right;
  padding: 0.4rem;
  border-radius: 0.2rem;
  margin: 0.2em 0;
  
  & > p {
    font-size: 0.8rem;
    line-height: 0.9rem;
    margin: 0;
    padding: 0;
    color: ${(props) => (props.positive ? '#37dd38' : '#de392f')};
  }
`;
const Checked = styled(Checkmark)`
  color: #37dd38;
  height: 0.9rem;
  margin: 0 0.5rem 0 0;
  padding: 0;
`;
const Crossed = styled(Cross)`
  color: #de392f;
  height: 0.9rem;
  margin: 0 0.5rem 0 0;
  padding: 0;
`;

const FeedbackLabel = ({ hasFeedback }) => (
  <FeedbackLabelContainer positive={hasFeedback}>
    {hasFeedback ? <Checked /> : <Crossed />}
    <p>{hasFeedback ? 'Has feedback article' : 'Missing feedback article'}</p>
  </FeedbackLabelContainer>
);
FeedbackLabel.propTypes = {
  hasFeedback: PropTypes.bool.isRequired,
};

export {
  FeedbackLabel,
};
