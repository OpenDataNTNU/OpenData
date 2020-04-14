import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { EditAlt } from 'styled-icons/boxicons-solid/EditAlt';
import { useSelector } from 'react-redux';

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

const DescriptionEditButton = ({ uuid }) => {
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;
  const role = user ? user.userType : null;
  if (role === 1) {
    return (
      <EditButton to={`/dataType/description/${uuid}`}>
        <EditIcon />
      </EditButton>
    );
  }
  return null;
};

DescriptionEditButton.propTypes = {
  uuid: PropTypes.string.isRequired,
};


export {
  DescriptionEditButton,
};
