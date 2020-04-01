import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { ExpandLess } from 'styled-icons/material/ExpandLess';
import { ExpandMore } from 'styled-icons/material/ExpandMore';

import { alertActions } from '../../state/actions/alert';

const Less = styled(ExpandLess)`
  height: 1em;
  cursor: pointer;
`;

const More = styled(ExpandMore)`
  height: 1em;
  cursor: pointer;
`;

export const CategorySelector = ({ onChange, category }) => {
  const { uuid, name, hasChildren } = category;

  const [children, setChildren] = useState([]);
  const [expand, setExpand] = useState(false);

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
        const { children: receivedChildren } = await res.json();
        setChildren(receivedChildren);
      } catch (err) {
        dispatch(alertActions.error('Failed to fetch subcategories'));
      }
    };
    // only fetch if necessary
    if (hasChildren && expand && !children.length) {
      internal();
    }
  }, [expand]);

  if (expand) {
    return (
      <li>
        <label>
          {name}
          <input type="radio" name="category" value={uuid} onChange={onChange} />
        </label>
        <Less onClick={() => setExpand(false)} />
        <ul>
          {children.length > 0
            ? children.map((child) => (
              <CategorySelector key={child.uuid} onChange={onChange} category={child} />
            ))
            : <li>Loading...</li>}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <label>
        {name}
        <input type="radio" name="category" value={uuid} onChange={onChange} />
      </label>
      {hasChildren
        ? <More onClick={() => setExpand(true)} />
        : null}
    </li>
  );
};

CategorySelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  category: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hasChildren: PropTypes.bool.isRequired,
  }).isRequired,
};
