import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const CrossReferenceDatatype = ({ datatype }) => {
  const {
    name, metadataList,
  } = datatype;
  const userSelector = useSelector((state) => state.user);
  const { municipalityName } = userSelector.user;
  const otherMunicipalitiesData = metadataList
    .filter((data) => data.municipalityName !== municipalityName);
  return (
    <div>
      Other municipalities who offer data about
      {` ${name}`}
      :
      <ul>
        {otherMunicipalitiesData.map((data) => {
          const { uuid, municipalityName: municipality } = data;
          return (
            <li key={uuid}>
              <Link to={`/dataset/${uuid}`}>
                {municipality}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};


CrossReferenceDatatype.propTypes = {
  datatype: PropTypes.shape({
    name: PropTypes.string.isRequired,
    metadataList: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      municipalityName: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
