import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { CategoryListElement } from './CategoryListElement';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const Ul = styled.ul`
  min-width: 30em;
`;


export const TopLevelCategories = () => {
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch('/api/MetadataCategory');
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedCategories = await res.json();
        setCategories(receivedCategories);
      } catch (err) {
        dispatch(alertActions.error('Sadly, you have loaded the top level categories'));
      }
    };
    internal();
  }, []);

  return (
    <Wrapper>
      <h2>All Categories</h2>
      <Ul>
        {categories.map((category) => (
          <CategoryListElement key={category.uuid} category={category} />
        ))}
      </Ul>
    </Wrapper>
  );
};
