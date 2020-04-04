import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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

export const SingleCategory = ({ uuid }) => {
  const [category, setCategory] = useState({
    uuid,
    name: '',
    hasChildren: false,
    children: [],
    hasTypes: false,
    types: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/MetadataCategory/${uuid}`);
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedCategory = await res.json();
        setCategory(receivedCategory);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Did not find the category you requested'));
        } else {
          dispatch(alertActions.error('Something went wrong while trying to get information about this category.'));
        }
      }
    };
    internal();
  }, [uuid]);

  const {
    name, hasChildren, children, types,
  } = category;
  return (
    <Wrapper>
      <h1>{name}</h1>
      {hasChildren
        ? (
          <>
            <h2>Subcategories</h2>
            <Ul>
              {children.map((child) => <CategoryListElement key={child.uuid} category={child} />)}
            </Ul>
          </>
        )
        : <h2>No subcategories</h2>}
      {types.length > 0
        ? (
          <>
            <h2>Types</h2>
            <Ul>
              {types.map(({ name: typeName, uuid: typeUuid }) => (
                <li key={typeUuid}>
                  <Link to={`/dataType/${typeUuid}`}>
                    {typeName}
                  </Link>
                </li>
              ))}
            </Ul>
          </>
        )
        : <h2>No types</h2>}
    </Wrapper>
  );
};

SingleCategory.propTypes = {
  uuid: PropTypes.string.isRequired,
};
