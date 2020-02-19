import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { MunicipalityMetadataResults } from './MunicipalityMetadataResults';
import { Template } from '../../sharedComponents/Template';
import { NoResult } from './NoResult';
import { alertActions } from '../../state/actions/alert';

const MunicipalitiesViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  max-width: 60em;
  margin: auto;
  background-color: white;
  flex: 1;
`;

const LeftPane = styled.div`
  width: 15em;
  display: flex;
  flex-direction: column;  
  border-right: 0.1em solid lightgray;
  border-left: 0.1em solid lightgray;
  overflow-y: scroll;
  & > h2 {
    padding: 0.2em 0.5em;
    font-weight: 300;
    color: dimgray;
  }
`;

const MunicipalityFilter = styled.input`
  padding: 0.3em;
  border-radius: 0.3em;
  border: solid 0.1em lightgrey;
  display: block;
  box-sizing: border-box;
  margin: 0.3em;
  font-size: 1.0em;
`;

const Picker = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;  
`;

const RadioDiv = styled.div`
  padding: 0;
  border-bottom: 0.1em solid lightgray;
  cursor: pointer;
  
  &:hover {
    background-color: #f2f2f2;
  }
  
  & > input[type="radio"] {
    display: none;
  }
  
  & > label {
    font-size: 1.1em;
    padding: 0.5em 1.0em;
    display: block;
    color: #2d2d2d;
  }
  
  & > input[type="radio"]:checked+label {
    font-weight: bold;
    border-left: solid 0.4em lightgray;
  }
`;

const ResultView = styled.div`
  flex: 1;
  display: flex;
`;

const MetadataByMunicipality = () => {
  // let { urlMunicipality, urlCategory } = useParams();
  const [municipalities, setMunicipalities] = useState([]);
  const [fetchedMunicipalities, setFetchedMunicipalities] = useState([]);
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleMunicipalitySelection = ({ target: { value } }) => {
    setSelectedMunicipality(value);
  };

  const handleMunicipalityFilterSelection = ({ target: { value } }) => {
    setMunicipalityFilter(value);
  };

  const updateFilteredMunicipalities = () => {
    setMunicipalities(
      fetchedMunicipalities.filter(
        (m) => m.name.toLowerCase().includes(municipalityFilter.toLowerCase()),
      ),
    );
  };

  useState(() => {
    const internal = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/Municipality');
        const receivedMunicipalities = await res.json();
        if (receivedMunicipalities) {
          setFetchedMunicipalities(receivedMunicipalities);
          setMunicipalities(receivedMunicipalities);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not find the municipalities.'));
        } else {
          dispatch(alertActions.error('Failed to fetch municipalities. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, []);

  useEffect(() => {
    updateFilteredMunicipalities();
  }, [municipalityFilter]);

  if (loading) {
    return (
      <Template>
        <NoResult text="Loading municipalities..." />
      </Template>
    );
  }
  return (
    <Template>
      <MunicipalitiesViewContainer>
        <LeftPane>
          <MunicipalityFilter type="text" placeholder="Search municipalites" onChange={handleMunicipalityFilterSelection} />
          <Picker onChange={handleMunicipalitySelection}>
            { municipalities.length === 0 ? <p>No municipalities found!</p>
              : municipalities.map((m) => (
                <RadioDiv key={m.name}>
                  <input type="radio" key={m.name} id={`radio-${m.name}`} name="radio-municipality" value={m.name} />
                  <label htmlFor={`radio-${m.name}`}>{m.name}</label>
                </RadioDiv>
              )) }
          </Picker>
        </LeftPane>
        <ResultView>
          { selectedMunicipality !== null
            ? <MunicipalityMetadataResults municipalityName={selectedMunicipality} />
            : (
              <NoResult text="Select a municipality to examine." />
            )}
        </ResultView>
      </MunicipalitiesViewContainer>
    </Template>
  );
};

export {
  MetadataByMunicipality,
};
