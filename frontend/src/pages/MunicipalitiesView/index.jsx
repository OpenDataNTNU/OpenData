import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Template } from '../../sharedComponents/Template';
import { useParams } from 'react-router-dom';

const MunicipalitiesViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  max-width: 60em;
  margin: auto;
  background-color: white;
`;
const LeftPaneForm = styled.form`
  max-width: 15em;
  display: flex;
  flex-direction: column;  
  border-right: 0.1em solid lightgray;
  height: 100%;
  
  & > h2 {
    padding: 0.2em 0.5em;
  }
`;
const RadioDiv = styled.label`
  padding: 0;
  border-bottom: 0.1em solid lightgray;
  cursor: pointer;
  
  &:hover {
    background-color: #efefef;
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
  }
`;
const NoMunicipality = styled.div`
  padding: 2em;
  display: flex;
  flex: 1;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  
  & > p {
    color: lightgray;
    font-size: 10em;
    max-width: 40em;
    font-weight: bold;
  }
`;

const MunicipalitiesView = () => {
  // let { urlMunicipality, urlCategory } = useParams();

  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState([]);
  useState(() => {
    const internal = async () => {
      const res = await fetch('/api/Municipality');
      const receivedMunicipalities = await res.json();
      if (receivedMunicipalities) {
        setMunicipalities(receivedMunicipalities);
      }
    };
    internal();
  }, []);

  const handleMunicipalitySelection = (event) => {
    const { target: { value } } = event;
    setSelectedMunicipality(value);
  };

  useEffect(() => {
    // Add some things?

  }, [selectedMunicipality]);

  return (
    <Template>
      <MunicipalitiesViewContainer>
        <LeftPaneForm onChange={handleMunicipalitySelection}>
          <h2>Municipality</h2>
          { municipalities.map((m) => (
            <RadioDiv>
              <input type="radio" key={m.name} id={`radio-${m.name}`} name="radio-municipality" value={m.name} />
              <label htmlFor={`radio-${m.name}`}>{m.name}</label>
            </RadioDiv>
          )) }
        </LeftPaneForm>
        <div>
          { selectedMunicipality ? <MunicipalityCategories municipality={selectedMunicipality} />
            : (
              <NoMunicipality>
                <p>Select a municipality from the left side</p>
              </NoMunicipality>
            )
          }
        </div>
      </MunicipalitiesViewContainer>
    </Template>
  );
};

export {
  MunicipalitiesView,

};
