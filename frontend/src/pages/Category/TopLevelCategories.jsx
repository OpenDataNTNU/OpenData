import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { CategoryList } from './CategoryList';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
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
      <h2>Categories</h2>
      <CategoryList categories={categories} />
    </Wrapper>
  );
};
