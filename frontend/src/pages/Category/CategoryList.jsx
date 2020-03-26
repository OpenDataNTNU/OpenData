import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`

`;

export const CategoryList = ({ categories }) => (
  <Wrapper>
    {categories.map(({ uuid, name }) => (
      <div key={uuid}>
        <Link to={`/category/${uuid}`}>
          <h3>{name}</h3>
        </Link>
      </div>
    ))}
  </Wrapper>
);

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    hasChildren: PropTypes.bool.isRequired,
    hasTypes: PropTypes.bool.isRequired,
  })).isRequired,
};
