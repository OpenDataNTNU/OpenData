import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Template } from '../../sharedComponents/Template';
import { MetadataByTypeResults } from './MetadataByTypeResults';
import { NoResult } from '../MetadataByMunicipality/NoResult';
import { alertActions } from '../../state/actions/alert';

const Background = styled.div`
  width: 100%;
  flex: 1;
  background-color: #eeeeee;
  padding: 0.5rem;
  box-sizing: border-box;
`;
const MetadataTypesViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  max-width: 60rem;
  margin: auto;
  background-color: white;
  border-radius: 0.3rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-sizing: border-box;
`;

const LeftPane = styled.div`
  width: 14rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;  
  border-right: 0.1rem solid lightgray;
  overflow-y: scroll;
  & > h2 {
    padding: 0.2rem 0.5rem;
    font-weight: 300;
    color: dimgray;
  }
`;
const Tag = styled.p`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.8rem;
  padding: 0.1rem 0.7rem;
  display: inline-block;
  border-radius: 1rem;
  margin: 0.3rem;
`;
const MetadataTypeFilter = styled.input`
  padding: 0.3rem;
  border-radius: 0.3rem;
  border: solid 0.1rem lightgrey;
  display: block;
  box-sizing: border-box;
  margin: 0.3rem;
  font-size: 1.0rem;
`;

const Picker = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;  
`;

const RadioDiv = styled.div`
  padding: 0;
  border-bottom: 0.1rem solid lightgray;
  cursor: pointer;
  
  &:hover {
    background-color: #f2f2f2;
  }
  
  & > input[type="radio"] {
    display: none;
    width: 0;
    height: 0;
    position: fixed;
  }
  
  & > label {
    font-size: 1.1rem;
    padding: 0.5rem 1.0rem 0.5rem 0.8rem;
    display: block;
    color: #2d2d2d;
    & > p {
      font-size: 0.8rem;
      color: dimgray;
    }
  }
  
  & > input[type="radio"]:checked+label {
    border-left: solid 0.3rem lightgray;
    padding: 0.5rem 1.0rem 0.5rem 0.5rem;
  }
`;

const ResultView = styled.div`
  flex: 1;
  display: flex;
  max-width: 46rem;
  box-sizing: border-box;
`;

export const MetadataByType = () => {
  const { name } = useParams();

  const [categories, setCategories] = useState([]);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleCategorySelection = ({ target: { value } }) => {
    setSelectedCategory(value);
  };

  const handleCategoryFilterSelection = ({ target: { value } }) => {
    setCategories(
      fetchedCategories.filter(
        (c) => c.name.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/MetadataType');
        const receivedCategories = await res.json();
        if (receivedCategories) {
          setFetchedCategories(receivedCategories);
          setCategories(receivedCategories);
        }
        if (name) setSelectedCategory(name);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not receive categories.'));
        } else {
          dispatch(alertActions.error('Failed to fetch categories. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, []);

  if (loading) {
    return (
      <Template>
        <MetadataTypesViewContainer>
          <NoResult text="Loading categories..." />
        </MetadataTypesViewContainer>
      </Template>
    );
  }
  return (
    <Template>
      <Background>
        <MetadataTypesViewContainer>
          <LeftPane>
            <MetadataTypeFilter type="text" placeholder="Search categories" onChange={handleCategoryFilterSelection} />
            <Picker onChange={handleCategorySelection}>
              { categories.length === 0 ? <p>No categories found!</p>
                : categories.map((c) => (
                  <RadioDiv key={c.name}>
                    <input type="radio" key={c.name} id={`radio-${c.name}`} name="radio-category" value={c.name} />
                    <label htmlFor={`radio-${c.name}`}>
                      {c.name}
                      <p>{c.description}</p>
                      {c.tags.map(({ tagName }) => <Tag>{tagName}</Tag>)}
                    </label>
                  </RadioDiv>
                )) }
            </Picker>
          </LeftPane>
          <ResultView>
            { selectedCategory !== null
              ? <MetadataByTypeResults metadataTypeName={selectedCategory} />
              : (
                <NoResult text="Select a category to examine." />
              )}
          </ResultView>
        </MetadataTypesViewContainer>
      </Background>
    </Template>
  );
};
