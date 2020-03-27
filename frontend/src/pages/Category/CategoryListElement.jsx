import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ExpandLess } from 'styled-icons/material/ExpandLess';
import { ExpandMore } from 'styled-icons/material/ExpandMore';


import { useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';
import { TypeList } from './TypeList';

const Less = styled(ExpandLess)`
  height: 1em;
  cursor: pointer;
`;

const More = styled(ExpandMore)`
  height: 1em;
  cursor: pointer;
`;

export const CategoryListElement = ({ category }) => {
  const { uuid, name } = category;
  const [loadedChildren, setLoadedChildren] = useState(null);
  const [loadedTypes, setLoadedTypes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch();

  const toggleExpanded = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (!loadedChildren) {
      try {
        setLoading(true);
        const res = await fetch(`/api/MetadataCategory/${uuid}`);
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const { children: receivedChildren, types: receivedTypes } = await res.json();
        setLoadedChildren(receivedChildren);
        setLoadedTypes(receivedTypes);
        setLoading(false);
      } catch (err) {
        dispatch(alertActions.error(`Something went wrong when loading subcategories of ${name}`));
      }
    }
  };

  const getList = () => {
    if (loading) {
      return (
        <ul>
          <li>Loading...</li>
        </ul>
      );
    }
    if (loadedChildren.length === 0 && loadedTypes.length === 0) {
      return (
        <ul>
          <li>No results</li>
        </ul>
      );
    }
    return (
      <>
        <ul>
          {loadedChildren.map((child) => <CategoryListElement key={child.uuid} category={child} />)}
        </ul>
        <TypeList types={loadedTypes} />
      </>
    );
  };

  return (
    <li key={uuid}>
      <Link to={`/category/${uuid}`}>
        {name}
      </Link>
      {expanded
        ? (
          <>
            <Less onClick={toggleExpanded} />
            {getList()}
          </>
        ) : <More onClick={toggleExpanded} />}
    </li>
  );
};

CategoryListElement.propTypes = {
  category: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hasChildren: PropTypes.bool.isRequired,
    hasTypes: PropTypes.bool.isRequired,
  }).isRequired,
};
