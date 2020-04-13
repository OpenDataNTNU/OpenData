import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../../router/history';
import { alertActions } from '../../state/actions/alert';
import { WizardContext } from './Context';
import { FinalizedDataset } from './FinalizedDataset';
import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Datasets = styled.div`
  padding: 5px;
  overflow: auto;
  flex: 1;
`;

const Submission = () => {
  const reduxDispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { token, municipalityName } = userSelector.user;

  const { state } = useContext(WizardContext);

  const [loading, setLoading] = useState(false);

  // filter out the selected datasets
  const selectedDatasets = state.datasetsState.datasets.filter((dataset) => (
    state.datasetsState.selections.get(dataset.id)
  ));

  const onSubmit = async () => {
    const catalogUUIDMapping = new Map();

    setLoading(true);

    try {
      await Promise.all(state.mimetypes.map((mimetype) => fetch('/api/DataFormat', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          name: mimetype.split('/')[1],
          description: '[No Description]',
          mimeType: mimetype,
          documentationUrl: 'http://google.com/fuck+this',
        }),
      })));

      const selectedCatalogs = [...state.catalogsState.selections].filter(
        ([k, v]) => v, // eslint-disable-line no-unused-vars
      ).map(([k, v]) => k); // eslint-disable-line no-unused-vars
      const catalogsToPut = [...state.catalogsState.typeMap].filter(
        ([k, v]) => selectedCatalogs.indexOf(k) !== -1, // eslint-disable-line no-unused-vars
      );
      const catalogResponses = await Promise.all(catalogsToPut.map(([k, v]) => fetch('/api/MetadataType', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          name: k,
          description: '[No Description]',
          categoryUuid: v,
        }),
      })));

      // Check if the tags submission was OK
      for (const catalogResponse of catalogResponses) { // eslint-disable-line no-restricted-syntax
        if (!catalogResponse.ok || catalogResponse.status !== 200) {
          // If it wasnt throw an error
          throw new Error(catalogResponse.statusText);
        }
        const responseData = await catalogResponse.json(); // eslint-disable-line no-await-in-loop
        catalogUUIDMapping.set(responseData.name, responseData.uuid);
      }

      const datasetCatalogConnectionCopy = new Map(state.datasetCatalogConnection);
      datasetCatalogConnectionCopy.forEach((value, key) => {
        const data = state.datasetsState.datasets.find((element) => element.id === key);

        data.catalog = [value[0], catalogUUIDMapping.get(value[0])];

        datasetCatalogConnectionCopy.set(key, data);
      });

      const datasetResponses = await Promise.all(
        [...datasetCatalogConnectionCopy].map(
          async ([k, v]) => { // eslint-disable-line no-unused-vars
            const dataset = await fetch('/api/Metadata', {
              method: 'PUT',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              redirect: 'follow',
              referrerPolicy: 'no-referrer',
              body: JSON.stringify({
                description: v.title,
                releaseState: 1,
                metadataTypeUuid: v.catalog[1],
                municipalityName,
              }),
            });

            const responseData = await dataset.json();

            for (const distribution of v.distributions) {
              for (const f of distribution.format) {
                await fetch('/api/Metadata/url', { // eslint-disable-line no-await-in-loop
                  method: 'PUT',
                  mode: 'cors',
                  cache: 'no-cache',
                  credentials: 'same-origin',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  redirect: 'follow',
                  referrerPolicy: 'no-referrer',
                  body: JSON.stringify({
                    metadataUuid: responseData.uuid,
                    url: distribution.url,
                    description: distribution.description,
                    dataFormatMimeType: f['@id'],
                    startDate: null,
                    endDate: null,
                  }),
                });
              }
            }

            return dataset;
          },
        ),
      );

      // Check if the tags submission was OK
      for (const datasetResponse of datasetResponses) { // eslint-disable-line no-restricted-syntax
        if (!datasetResponse.ok || datasetResponse.status !== 200) {
          // If it wasnt throw an error
          throw new Error(datasetResponse.statusText);
        }
      }

      reduxDispatch(alertActions.success('Upload finished successfully! Redirecting in 3 seconds.'));
      setTimeout(() => history.push('/'),
        3000);
    } catch (_) {
      reduxDispatch(alertActions.error('Upload failed!'));
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Datasets>
        {
          selectedDatasets && selectedDatasets.map(({ id, title, distributions }) => (
            <FinalizedDataset
              key={id}
              id={id}
              title={title}
              distributions={distributions}
              metadataType={(state.datasetCatalogConnection.get(id))[0]}
            />
          ))
        }
      </Datasets>
      <LoadingButton text="Submit Datasets and Catalogs" loading={loading} onClick={onSubmit} />
    </Wrapper>
  );
};

export {
  Submission,
};
