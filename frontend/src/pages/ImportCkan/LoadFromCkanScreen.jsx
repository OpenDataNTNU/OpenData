import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input } from '../../sharedComponents/Input';
import { LoadingButton } from '../../sharedComponents/LoadingButton';

import { ProgressBar, ProgressBarContainer } from './ProgressBar';

const WizardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-around;
  max-width: 50em;
  min-width: 20em;
  padding: 1em;
  margin: 10px 0px;
  background-color: white;
  border-radius: 4px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const ErrorContainer = styled.div`
  background-color: #ffcccc;
  border-radius: 4px;
  border: 1px solid #ff5555;
  padding: 1em;
  margin-top: 1em;
`;

export const LoadFromCkanScreen = ({ setTags, setGroups, nextState }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(-1);
  const [error, setError] = useState(null);

  const fail = (err) => {
    setError(err);
    setLoading(false);
  };

  const checkCkan = (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);

    async function fetchCkanUrl() {
      try {
        setError(null);
        const groups = await (await fetch(`${url}/action/package_list`)).json();
        const tags = await (await fetch(`${url}/action/tag_list`)).json();

        if (typeof groups.result === 'undefined') {
          fail('Invalid API: Groups api call gave the wrong response');
          return;
        }

        if (typeof tags.result === 'undefined') {
          fail('Invalid API: Tags api call gave the wrong response');
          return;
        }

        if (groups.result.length === 0 || tags.result.length === 0) {
          fail('Empty CKAN server');
          return;
        }
        const newTags = [];
        for (const tag of tags.result) {
          if (newTags.indexOf(tag.toLowerCase()) === -1) {
            newTags.push(tag.toLowerCase());
          }
        }

        const newGroups = [];
        let done = 0;
        for (const group of groups.result) {
          // We disable the linting rule here to rate-limit the client
          // this function will access a foreign api.
          // eslint-disable-next-line no-await-in-loop
          const groupMetadata = await (await fetch(`${url}/action/package_show?id=${group}`)).json();
          done += 1;
          setProgress(done / groups.result.length);
          if (groupMetadata.success !== true) {
            fail(`Failed to import from CKAN: Got a bad result on the package ${group}`);
            return;
          }
          for (const resource of groupMetadata.result.resources) {
            resource.openDataMetadata = {
              ignore: false,
              hasDate: false,
              startDate: '',
              endDate: '',
            };
          }
          groupMetadata.result.openDataMetadata = {
            strategy: 0,
            metadataType: null,
            metadata: null,
            metadataTypeName: groupMetadata.result.name,
            metadataTypeDescription: groupMetadata.result.notes,
            metadataTypeCategory: '',
          };
          newGroups.push(groupMetadata.result);
        }

        setTags(newTags);
        setGroups(newGroups);

        setLoading(false);
        nextState();
      } catch (err) {
        fail(`Javascript error: ${err}`);
      }
    }
    fetchCkanUrl();
  };

  const onUpdate = (e) => {
    setUrl(e.target.value);
  };

  return (
    <WizardContainer>
      <h1>Import from CKAN APIv3</h1>
      <p>
        If you have a CKAN server, you can selectively import contents from there.
        Enter an URL, and we will check it for validity.
      </p>
      <p>
        This process takes some time, as you need to manually vet each entry to import.
        Grab a beverage of your choice before you begin.
      </p>
      <p>
        Enter it in the format
        {' '}
        <code>https://webpage.com/api/3</code>
      </p>
      <Input value={url} title="Enter your URL..." onChange={onUpdate} />
      <LoadingButton text="Import" onClick={checkCkan} loading={loading} />
      {
                progress !== -1 ? (
                  <ProgressBarContainer>
                    <ProgressBar progress={progress} />
                  </ProgressBarContainer>
                ) : null
            }
      { error !== null ? (
        <ErrorContainer>
          <h3>Failed to load data from the CKAN server</h3>
          <p>
            Check that you entered your URL correctly - it is easy to forget to end the url with
            <code>/api/3</code>
            . Maybe the server is down - have you tried visiting it yourself?
          </p>
          <p>{error.toString()}</p>
        </ErrorContainer>
      ) : null }
    </WizardContainer>
  );
};

LoadFromCkanScreen.propTypes = {
  setTags: PropTypes.func.isRequired,
  setGroups: PropTypes.func.isRequired,
  nextState: PropTypes.func.isRequired,
};
