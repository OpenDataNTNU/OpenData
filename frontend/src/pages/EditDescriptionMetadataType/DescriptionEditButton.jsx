import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { EditAlt } from 'styled-icons/boxicons-solid/EditAlt';

const EditButton = styled(Link)`
  float: right;
  color: #575757;
  border: none;
  padding: 0;
  margin: 0 0 0.3rem 0.3rem;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    color: #929292;
  }
`;
const EditIcon = styled(EditAlt)`
  color: inherit;
  width: 1.9rem;
  height: 1.9rem;
`;

const DescriptionEditButton = ({ uuid }) => (
  <EditButton to={`/dataType/description/${uuid}`}>
    <EditIcon />
  </EditButton>
);

DescriptionEditButton.propTypes = {
  uuid: PropTypes.string.isRequired,
};


export {
  DescriptionEditButton,
};
