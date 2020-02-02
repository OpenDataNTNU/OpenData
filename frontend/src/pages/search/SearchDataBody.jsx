import React from 'react';
import styled from 'styled-components';

import { SearchField } from './SearchField';

const OuterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Filters = styled.div`
  flex: 1;
`;

const SearchAndResults = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const Results = styled.div`
  flex: 2;
`;

export const SearchDataBody = () => (
  <OuterWrapper>
    <Filters>
      <ul>
        <li>
            Filter 1
          <ul>
            <li>Filter 1a</li>
            <li>Filter 1b</li>
          </ul>
        </li>
        <li>
            Filter 2
          <ul>
            <li>Filter 2a</li>
            <li>Filter 2b</li>
          </ul>
        </li>
        <li>
            Filter 3
        </li>
      </ul>
    </Filters>
    <SearchAndResults>
      <SearchField />
      <Results>Display results aqui</Results>
    </SearchAndResults>
  </OuterWrapper>
);
