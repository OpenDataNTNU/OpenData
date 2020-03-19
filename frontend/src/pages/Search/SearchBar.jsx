import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Multiselect from 'react-widgets/lib/Multiselect';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [municipalities, setMunicipalities] = useState([]);

  const allMunicipalities = useGetValidMunicipalities() || [];
  const allMunicipalityNames = allMunicipalities.map(({ name: n }) => n);


  const updateQueries = () => {
    setQuery({
      name,
      description,
      municipalities,
    });
  };

  return (
    <OuterWrapper>
      <InputWrapper>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
