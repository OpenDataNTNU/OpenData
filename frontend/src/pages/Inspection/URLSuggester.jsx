import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 50rem;
  padding: 0 0.5rem;
`;
const Form = styled.form`
  
`;

const URLSuggester = ({ expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <Wrapper>
        <button type="button" onClick={handleExpansion}>Submit another URL to this dataset</button>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Form>
        <input type="text" placeholder="https//url-to-data.net/something.json" />
        <button type="submit">Submit</button>
      </Form>
    </Wrapper>
  );
};

URLSuggester.propTypes = {
  expanded: PropTypes.bool,
};
URLSuggester.defaultProps = {
  expanded: false,
};

export {
  URLSuggester,
};
