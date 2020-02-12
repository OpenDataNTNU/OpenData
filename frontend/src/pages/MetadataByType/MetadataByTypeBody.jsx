import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const MetadataByTypeBody = (props) => {
  const { name } = props;
  const [metadatas, setMetadatas] = useState([]);

  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/metadataType/${name}`);
      const { metadataList } = await res.json();
      setMetadatas(metadataList);
    };
    internal();
  }, [name]);
  return (
    <div>
      <h1>
        Metadata type:
        {` ${name}`}
      </h1>
      <h3>This data set is offered by:</h3>
      <ul>
        {metadatas.map(({ uuid, municipalityName }) => (
          <a key={uuid} href={`/viewData/dataset/${uuid}`}>
            <p>
              {municipalityName}
            </p>
          </a>
        ))}
      </ul>
    </div>
  );
};

MetadataByTypeBody.propTypes = {
  name: PropTypes.string.isRequired,
};
