import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input } from '../../sharedComponents/Input';

const ResourceInner = styled.div`
  margin: 2em 0em;
  border-bottom: 1px solid #000;
  border-top: 1px solid #000;
`;

const Resource = ({
  resource, handleMetadataChange, updateResourceName, index,
}) => (
  <ResourceInner>
    <h3>
      Resource:
      {resource.name}
    </h3>
    <Input type="text" value={resource.name} onChange={(e) => updateResourceName(index, e.target.value)} placeholder="Name" required />
    <p>
      Format:
      {resource.format}
    </p>
    <p>
      Do not import:
      <input type="checkbox" checked={resource.openDataMetadata.ignore} onChange={(e) => { handleMetadataChange(index, 'ignore', e.target.checked); }} />
    </p>
    <p><code>{resource.url}</code></p>
    <h4>Start/end time</h4>
    <p>
      Has start/end date:
      <input type="checkbox" checked={resource.openDataMetadata.hasDate} onChange={(e) => { handleMetadataChange(index, 'hasDate', e.target.checked); }} />
    </p>
    {
        resource.openDataMetadata.hasDate ? (
          <div>
            <label htmlFor={`dateFrom${index}`}>
              Start date:
              <Input id={`dateFrom${index}`} type="date" placeholder="From" name="startDate" value={resource.openDataMetadata.startDate} onChange={(e) => { handleMetadataChange(index, 'startDate', e.target.value); }} />
            </label>
            <label htmlFor={`dateFrom${index}`}>
              End date:
              <Input id={`dateFrom${index}`} type="date" placeholder="To" name="endDate" value={resource.openDataMetadata.endDate} onChange={(e) => { handleMetadataChange(index, 'endDate', e.target.value); }} />
            </label>
          </div>
        ) : null
      }
  </ResourceInner>
);

Resource.propTypes = {
  resource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    openDataMetadata: PropTypes.shape({
      ignore: PropTypes.bool.isRequired,
      hasDate: PropTypes.bool.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }).isRequired,
  }).isRequired,
  handleMetadataChange: PropTypes.func.isRequired,
  updateResourceName: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Resource;
