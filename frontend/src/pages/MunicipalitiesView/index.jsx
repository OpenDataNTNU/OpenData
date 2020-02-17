import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { MunicipalityMetadataResults } from './MunicipalityMetadataResults';
import { Template } from '../../sharedComponents/Template';
import { NoResult } from './NoResult';

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

const LeftPaneForm = styled.form`
  max-width: 15em;
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

const RadioDiv = styled.label`
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

const MunicipalitiesView = () => {
  // let { urlMunicipality, urlCategory } = useParams();
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);
  useState(() => {
    const internal = async () => {
      setLoading(true);
      const res = await fetch('/api/Municipality');
      const receivedMunicipalities = await res.json();
      if (receivedMunicipalities) {
        setMunicipalities(receivedMunicipalities);
      }
      setLoading(false);
    };
    internal();
  }, []);

  const handleMunicipalitySelection = (event) => {
    const { target: { value } } = event;
    setSelectedMunicipality(value);
  };

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
        <LeftPaneForm onChange={handleMunicipalitySelection}>
          <h2>Municipality</h2>
          { municipalities.length === 0 ? <p>No municipalities found!</p>
            : municipalities.map((m) => (
              <RadioDiv key={m.name}>
                <input type="radio" key={m.name} id={`radio-${m.name}`} name="radio-municipality" value={m.name} />
                <label htmlFor={`radio-${m.name}`}>{m.name}</label>
              </RadioDiv>
            )) }

        </LeftPaneForm>

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
  MunicipalitiesView,

};
