import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { Input } from '../../sharedComponents/Input';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
import { ProgressBar, ProgressBarContainer } from './ProgressBar';

// Joink
import { RootLevelCategorySelector } from '../NewMetadataType/RootLevelCategorySelector';

import Resource from './Resource';

const OuterContainer = styled.div`
`;

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
`;

const ResourceContainer = styled.div`
  >div {
    border-top: 1px solid #000;
  }
`;

const UpcomingEntry = styled.div`
  border-bottom: 1px solid #aaa;
`;

const NavigationContainer = styled.div`
  display: flex;

`;

const Select = styled.select`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  min-height: 150px;
  width: 100%;
  resize: vertical;
  margin-bottom: 5px;
  font-size: 16px;
  border-radius: 4px;
  color: black;
  border: 1px solid darkgray;
`;

const OptionContainer = styled.div`
  width: 100%;
  border-radius: 0.4em;
  display: flex;

  background-color: #ccccff;
  border: 1px solid #A19AE6;
`;

const OptionEntryContainer = styled.div`
  flex: 1;
  border-right: 1px solid #A19AE6;
  padding: 1em 1em;

  cursor: pointer;

  :hover {
    background-color: #A19AE6;
  }

  :last {
    border-right: none;     
  }
`;

const OptionEntry = ({ current, name, onClick }) => (
  <OptionEntryContainer style={current ? { backgroundColor: '#A19AE6' } : {}} onClick={onClick}>
    {name}
  </OptionEntryContainer>
);
OptionEntry.propTypes = {
  current: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};


export const SelectGroupsScreen = ({ groups, updateGroup, nextState }) => {
  const [loading, setLoading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [total, setTotal] = useState(0);
  const [metadataTypes, setMetadataTypes] = useState({});
  const [tags, setTags] = useState([]);
  const [myMetadatas, setMyMetadatas] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const userSelector = useSelector((state) => state.user);
  const { municipalityName, token } = userSelector.user;

  const currentGroup = groups[currentIndex];

  const LoadMetadataTypes = async () => {
    setLoading(0);
    const types = await (await fetch('/api/MetadataType')).json();
    setMetadataTypes(types.reduce((acc, cur) => {
      acc[cur.uuid] = cur;
      return acc;
    }, {}));

    const tagsResult = await (await fetch('/api/Tag')).json();

    setTags(tagsResult.map((tag) => tag.name.toLowerCase()));

    const metadata = [];
    setTotal(types.length);

    for (const type of types) {
      /*
      The web browser is not made to handle a boatload of requests
      Until a paralell queue system is implemented, you have to run these requests in-order.

      Not doing this will cause bugs when the type list gets big enough.
      */
      // eslint-disable-next-line no-await-in-loop
      const typeData = await (await fetch(`/api/MetadataType/${type.uuid}`)).json();
      typeData.metadataList.forEach((entry) => {
        if (entry.municipalityName === municipalityName) {
          const newEntry = entry;
          newEntry.name = `${type.name}: ${entry.description.slice(0, 20)}`;
          metadata.push(newEntry);
        }
      });
    }
    setMyMetadatas(metadata);
    setLoadingState(-1);
  };

  useEffect(() => {
    LoadMetadataTypes();
  }, []);

  const fail = (err) => {
    setError(err);
    setSaving(false);
  };

  const nextPage = () => {
    if (currentIndex === groups.length - 1) {
      nextState();
    } else {
      window.scrollTo(0, 0);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const savePage = async () => {
    setSaving(true);
    // Create metadata type
    let metadataTypeUuid = currentGroup.openDataMetadata.metadataType;
    if (currentGroup.openDataMetadata.strategy === 0) {
      if (currentGroup.openDataMetadata.metadataTypeCategory === '') {
        fail('You have to specify a category for the metadata type to appear in');
        return;
      }
      const result = await (await fetch('/api/MetadataType', {
        method: 'PUT',
        body: JSON.stringify({
          name: currentGroup.openDataMetadata.metadataTypeName,
          categoryUuid: currentGroup.openDataMetadata.metadataTypeCategory,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      })).json();

      metadataTypeUuid = result.uuid;

      // Now we have to create the tags
      for (const tag of currentGroup.tags) {
        if (tags.includes(tag.display_name.toLowerCase())) {
          // eslint-disable-next-line no-await-in-loop
          await (await fetch(`/api/MetadataType/${metadataTypeUuid}/tag`, {
            method: 'PUT',
            body: JSON.stringify({
              name: tag.display_name.toLowerCase(),
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${token}`,
            },
          })).json();
        }
      }

      // Add the description if it exists
      if (currentGroup.openDataMetadata.metadataTypeDescription.trim() !== '') {
        await (await fetch(`/api/MetadataType/${metadataTypeUuid}/description`, {
          method: 'PUT',
          body: JSON.stringify({
            content: currentGroup.openDataMetadata.metadataTypeDescription,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        })).json();
      }
    } else {
      // Append tags to the metadata type if they dont exist
      // Create an array of existing tags
      const typeTagList = metadataTypes[currentGroup.openDataMetadata.metadataType]
        .tags
        .map((tag) => tag.tagName.toLowerCase());

      for (const tag of currentGroup.tags) {
        // If the tag isn't already added on the metadata type
        if (!typeTagList.includes(tag.display_name.toLowerCase())) {
          // eslint-disable-next-line no-await-in-loop
          await (await fetch(`/api/MetadataType/${currentGroup.openDataMetadata.metadataType}/tag`, {
            method: 'PUT',
            body: JSON.stringify({
              name: tag.display_name.toLowerCase(),
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${token}`,
            },
          })).json();
        }
      }
    }

    // Create metadata
    let metadataUuid = currentGroup.openDataMetadata.metadata;
    if (currentGroup.openDataMetadata.strategy <= 1) {
      const createMetadataResult = await (await fetch('/api/Metadata', {
        method: 'PUT',
        body: JSON.stringify({
          description: currentGroup.notes,
          releaseState: 1, // Released (?)
          metadataTypeUuid,
          municipalityName,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      })).json();
      metadataUuid = createMetadataResult.uuid;
    }
    // Insert metadata
    for (const resource of currentGroup.resources) {
      if (resource.openDataMetadata.ignore !== true) {
        const payload = {
          metadataUuid,
          url: resource.url,
          description: resource.description === '' ? '(No description)' : 'resource.description',
          dataFormatMimeType: 'text/plain',
        };
        if (resource.openDataMetadata.hasDate) {
          payload.startDate = resource.openDataMetadata.startDate;
          payload.endDate = resource.openDataMetadata.endDate;
        }
        // eslint-disable-next-line no-await-in-loop
        await fetch('/api/Metadata/url', {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
      }
    }
    await LoadMetadataTypes();
    nextPage();
    setSaving(false);
  };

  const setInsertStrategy = (strategy) => {
    const grp = currentGroup;
    grp.openDataMetadata.strategy = strategy;
    updateGroup(currentIndex, grp);
  };

  const handleMetadataTypeChange = (v) => {
    const grp = currentGroup;
    grp.openDataMetadata.metadataType = v.target.value;
    updateGroup(currentIndex, grp);
  };

  const handleMetadataChange = (v) => {
    const grp = currentGroup;
    grp.openDataMetadata.metadata = v.target.value;
    updateGroup(currentIndex, grp);
  };

  const updateName = (n) => {
    const grp = currentGroup;
    grp.openDataMetadata.metadataTypeName = n;
    updateGroup(currentIndex, grp);
  };

  const updateDescription = (d) => {
    const grp = currentGroup;
    grp.openDataMetadata.metadataTypeDescription = d;
    updateGroup(currentIndex, grp);
  };

  const onCategoryChange = (c) => {
    const categoryUuid = c.currentTarget.value;

    const grp = currentGroup;
    grp.openDataMetadata.metadataTypeCategory = categoryUuid;
    updateGroup(currentIndex, grp);
  };

  const updateResourceName = (index, value) => {
    const grp = currentGroup;
    grp.resources[index].name = value;
    updateGroup(currentIndex, grp);
  };

  const handleResourceMetadataChange = (index, name, value) => {
    const grp = currentGroup;
    grp.resources[index].openDataMetadata[name] = value;
    updateGroup(currentIndex, grp);
  };

  let conversionStrategyGui = (
    <div>
      <h2>Create new metadata type</h2>
      <Input type="text" value={currentGroup.openDataMetadata.metadataTypeName} onChange={(e) => updateName(e.target.value)} placeholder="Name" required />
      <TextArea value={currentGroup.openDataMetadata.metadataTypeDescription} onChange={(e) => updateDescription(e.target.value)} placeholder="Description" required />
      <RootLevelCategorySelector onChange={onCategoryChange} />
    </div>
  );

  if (currentGroup.openDataMetadata.strategy === 1) {
    conversionStrategyGui = (
      <div>
        <h2>Select metadata type</h2>
        <Select name="metadataTypeName" value={currentGroup.openDataMetadata.metadataType} onChange={handleMetadataTypeChange} required>
          <option value="" disabled>Metadata type</option>
          {
            Object.keys(metadataTypes).map((key) => (
              <option key={key} value={key}>{metadataTypes[key].name}</option>
            ))
          }
        </Select>
      </div>
    );
  } else if (currentGroup.openDataMetadata.strategy === 2) {
    conversionStrategyGui = (
      <div>
        <h2>Select metadata</h2>
        <p><i>All resources will be appended to the selected metadata.</i></p>
        <Select name="metadataName" value={currentGroup.openDataMetadata.metadata} onChange={handleMetadataChange} required>
          <option value="" disabled>Metadata</option>
          {
            myMetadatas.map((metadata) => (
              <option key={metadata.uuid} value={metadata.uuid}>{metadata.name}</option>
            ))
          }
        </Select>
        <p>
          You have
          {' '}
          {myMetadatas.length}
          {' '}
          metadatas
        </p>
      </div>
    );
  }

  return (

    loadingState !== -1 ? (
      <div>
        <p>Please wait, loading database state</p>
        <ProgressBarContainer>
          <ProgressBar progress={loading / total} />
        </ProgressBarContainer>
      </div>
    ) : (
      <OuterContainer>
        <WizardContainer>
          <h1>{currentGroup.title}</h1>
          <LoadingButton text="Skip" onClick={nextPage} loading={false} />
          <p>{currentGroup.notes}</p>
          <p>
            <i>
              Published by
              {' '}
              {currentGroup.organization.title}
            </i>
          </p>
          <h2>Special fields</h2>
          <ul>
            {
              currentGroup.extras.map((extra) => (
                <li>
                  {extra.key}
                  :
                  {' '}
                  {extra.value}
                </li>
              ))
            }
          </ul>
          <OptionContainer>
            <OptionEntry current={currentGroup.openDataMetadata.strategy === 0} name="Add to new metadata type" onClick={() => { setInsertStrategy(0); }} />
            <OptionEntry current={currentGroup.openDataMetadata.strategy === 1} name="Add to existing Metadata type" onClick={() => { setInsertStrategy(1); }} />
            <OptionEntry current={currentGroup.openDataMetadata.strategy === 2} name="Add to existing metadata" onClick={() => { setInsertStrategy(2); }} />
          </OptionContainer>
          {
              conversionStrategyGui
          }
          <h2>Resources</h2>
          <ResourceContainer>
            {
              currentGroup.resources.map((resource, ind) => (
                <Resource
                  key={resource.id}
                  resource={resource}
                  handleMetadataChange={handleResourceMetadataChange}
                  updateResourceName={updateResourceName}
                  index={ind}
                />
              ))
            }
          </ResourceContainer>
          <NavigationContainer>
            <LoadingButton text="Skip" onClick={nextPage} loading={false} />
            <LoadingButton text="Save and continue" onClick={savePage} loading={saving} />
          </NavigationContainer>
          <ProgressBarContainer>
            <ProgressBar progress={currentIndex / groups.length} />
            <p>{ `${currentIndex} out of ${groups.length} done` }</p>
          </ProgressBarContainer>
          { error !== null ? (
            <ErrorContainer>
              <h3>An error has occurred</h3>
              <p>{error.toString()}</p>
            </ErrorContainer>
          ) : null }
        </WizardContainer>
        <WizardContainer>
          <h2>Upcoming entries</h2>
          {
              groups.slice(currentIndex + 1, currentIndex + 1 + 10).map((group) => (
                <UpcomingEntry>
                  <h3>{group.title}</h3>
                  <p>{group.notes}</p>
                  <p>
                    <i>
                      Published by
                      {group.organization.title}
                    </i>
                  </p>
                </UpcomingEntry>
              ))
          }
        </WizardContainer>
        <WizardContainer>
          <h2>How do i deal with this?</h2>
          <p>
            OpenData categorises metadata differently from other solutions.
            Additionally, there are often some inconsistencies in the way things are organized
            in a CKAT database.
            Therefore, we need a human to manually specify how things should be converted.
            This time it&apos;s you.
          </p>
          <p>
            Some times, a CKAT group might represent a metadata type.
            Other times, it represents a metadata entry. This can vary a lot.
          </p>
          <p>
            Your job is to select what granularity to import the group at.
            If you select that a group corresponds to a metadata entry,
            its resources will be converted to data sources.
          </p>
          <h2>Vocabulary</h2>
          <p>
            <b>Metadata Type</b>
            {' '}
            - a concept that there exists data about,
            such as &quot;# of car passes&quot; or &quot;road layout&quot;
          </p>
          <p>
            <b>Metadata</b>
            {' '}
            - metadata about a specific municipality&apos;s datasets,
            for a given concept/Metadata type.
            For example, metdata about Trondheim Kommune&apos;s dataset
            for the category &quot;# of car passes&quot;
          </p>
          <p>
            <b>Data Source</b>
            {' '}
            - a concrete dataset for a metadata entry.
            A metadata entry can have multiple datasets.
            This should be used if you have different datasets per time unit.
          </p>
        </WizardContainer>
      </OuterContainer>
    )

  );
};

SelectGroupsScreen.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    organization: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    extras: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    resources: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      openDataMetadata: PropTypes.shape({
        ignore: PropTypes.bool.isRequired,
        hasDate: PropTypes.bool.isRequired,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
      }).isRequired,
    })).isRequired,
    openDataMetadata: PropTypes.shape({
      strategy: PropTypes.number.isRequired,
      metadata: PropTypes.string.isRequired,
      metadataType: PropTypes.string.isRequired,
      metadataTypeName: PropTypes.string.isRequired,
      metadataTypeDescription: PropTypes.string.isRequired,
      metadataTypeCategory: PropTypes.string.isRequired,
    }),
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  updateGroup: PropTypes.func.isRequired,
  nextState: PropTypes.func.isRequired,
};
