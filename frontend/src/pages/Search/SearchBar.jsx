import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Multiselect from 'react-widgets/lib/Multiselect';

import { useGetTags } from '../../sharedComponents/hooks/GetTags';
import { useGetValidMunicipalities } from '../../sharedComponents/hooks/GetValidMunicipalities';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5em;
  & > * {
    margin-right: 0.3em;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Select = styled(Multiselect)`
  & > .rw-widget-picker > div {
    display: flex;
    align-items: center;
    & > ul > li {
      margin-top: 0px;
    }
  }
`;

export const SearchBar = ({ setQuery }) => {
  const nameField = useRef('');
  const descriptionField = useRef('');
  const [tags, setTags] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const allTags = useGetTags() || [];
  const allMunicipalities = useGetValidMunicipalities() || [];
  const allMunicipalityNames = allMunicipalities.map(({ name }) => name);


  const updateQueries = () => {
    setQuery({
      name: nameField.current.value,
      description: descriptionField.current.value,
      tags,
      municipalities,
    });
  };

  return (
    <OuterWrapper>
      <InputWrapper>
        <input type="text" placeholder="Name" ref={nameField} />
        <input type="text" placeholder="Description" ref={descriptionField} />
        <Select data={allTags} value={tags} onChange={setTags} placeholder="Tags" />
        <Select
          data={allMunicipalityNames}
          value={municipalities}
          onChange={setMunicipalities}
          placeholder="Municipalities"
        />
      </InputWrapper>
      <button type="button" onClick={updateQueries}>
        Search
      </button>
    </OuterWrapper>
  );
};

SearchBar.propTypes = {
  setQuery: PropTypes.func.isRequired,
};
