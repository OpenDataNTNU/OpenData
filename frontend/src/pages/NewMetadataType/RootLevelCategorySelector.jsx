import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { CategorySelector } from './CategorySelector';
import { alertActions } from '../../state/actions/alert';

export const RootLevelCategorySelector = ({ onChange }) => {
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
        dispatch(alertActions.error('Failed to fetch main categories'));
      }
    };
    internal();
  }, []);

  return (
    <ul>
      {categories.map((category) => (
        <CategorySelector key={category.uuid} category={category} onChange={onChange} />
      ))}
    </ul>
  );
};

RootLevelCategorySelector.propTypes = {
  onChange: PropTypes.func.isRequired,
};
