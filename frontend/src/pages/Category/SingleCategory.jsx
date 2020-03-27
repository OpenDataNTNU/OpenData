import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { CategoryListElement } from './CategoryListElement';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
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
            <ul>
              {children.map((child) => <CategoryListElement key={child.uuid} category={child} />)}
            </ul>
          </>
        )
        : null}
      {types.length > 0
        ? (
          <>
            <h2>Types</h2>
            {types.map(({ name: typeName, uuid: typeUuid }) => (
              <h3 key={typeUuid}>
                <Link to={`/dataType/${typeUuid}`}>
                  {typeName}
                </Link>
              </h3>
            ))}
          </>
        )
        : null}
    </Wrapper>
  );
};

SingleCategory.propTypes = {
  uuid: PropTypes.string.isRequired,
};
