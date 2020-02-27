import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import negativeIcon from '../../assets/ui/negative.svg';
import positiveIcon from '../../assets/ui/positive.svg';

const FeedbackLabelContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  float: right;
  padding: 0.4rem;
  
  border-radius: 0.2rem;
  margin: 0.2em 0;
  
  & > p {
    font-size: 0.9rem;
    line-height: 1.0rem;
    margin: 0;
    padding: 0;
    color: ${(props) => (props.positive ? '#37dd38' : '#de392f')};
  }
  & > img {
    height: 1.0rem;
    margin: 0 0.5rem 0 0;
    padding: 0;
  }
`;

const FeedbackLabel = ({ hasFeedback }) => (
  <FeedbackLabelContainer positive={hasFeedback}>
    <img src={hasFeedback ? positiveIcon : negativeIcon} alt="Feedback?" />
    <p>{hasFeedback ? 'Has feedback' : 'Missing feedback'}</p>
  </FeedbackLabelContainer>
);
FeedbackLabel.propTypes = {
  hasFeedback: PropTypes.bool.isRequired,
};

export {
  FeedbackLabel,
};
