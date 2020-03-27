import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ExpandLess } from 'styled-icons/material/ExpandLess';
import { ExpandMore } from 'styled-icons/material/ExpandMore';

const Less = styled(ExpandLess)`
  height: 1em;
  cursor: pointer;
`;

const More = styled(ExpandMore)`
  height: 1em;
  cursor: pointer;
`;

export const TypeList = ({ types }) => {
  const [expanded, setExpanded] = useState(false);
  if (types.length === 0) {
    return null;
  }
  return (
    <ul>
      <li>
        Data types
        {expanded
          ? <Less onClick={() => setExpanded(false)} />
          : <More onClick={() => setExpanded(true)} />}
      </li>
      {expanded
        ? (
          <ul>
            {types.map(({ name, uuid }) => (
              <li key={uuid}>
                <Link to={`/dataType/${uuid}`}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )
        : null}
    </ul>
  );
};

TypeList.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  })).isRequired,
};
