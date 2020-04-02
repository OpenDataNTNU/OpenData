import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { LoadingButton } from '../../sharedComponents/LoadingButton';

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
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const TagListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagContainer = styled.div`
  border-radius: 5px;
  border: 1px solid #6666aa;
  background-color: #ddddff;
  padding: 0.5em;
  margin: 1em;
  height: 2em;
  display: table-cell;
  width: 20em;
`;

const ButtonPart = styled.div`
  float: right;
`;

const LabelPart = styled.div`
  position: absolute;
  float: left;
  line-height: 2em;
`;

const ImportButton = styled.div`
  margin: 2px;
  border-radius: 4px;
  border: 1px solid #000000;
  background-color: #aaaaaa;
  padding: 0.2em;
`;

const NavigationContainer = styled.div`
  display: flex;
`;

const TagEntry = ({ tag, toggleEntry, index }) => {
  let existsButton = (<b>Already exists</b>);
  if (!tag.alreadyExists) {
    if (tag.import) {
      existsButton = (<ImportButton style={{ backgroundColor: '#66aa66' }}>Import</ImportButton>);
    } else {
      existsButton = (<ImportButton style={{ backgroundColor: '#aa6666' }}>Don&apos;t import</ImportButton>);
    }
  }
  return (
    <TagContainer onClick={() => { toggleEntry(index); }}>
      <LabelPart>
        {tag.name}
      </LabelPart>
      <ButtonPart>
        {
          existsButton
        }
      </ButtonPart>
    </TagContainer>
  );
};
TagEntry.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
    alreadyExists: PropTypes.bool.isRequired,
    import: PropTypes.bool.isRequired,
  }).isRequired,
  toggleEntry: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};


export const SelectTagsScreen = ({ tags, nextState, setTags }) => {
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const PAGE_SIZE = 20;

  const fail = () => {
    setLoading(false);
  };

  const nextPage = () => {
    if (offset + PAGE_SIZE < tags.length) {
      setOffset(offset + PAGE_SIZE);
    }
  };

  const prevPage = () => {
    setOffset(offset < PAGE_SIZE ? 0 : offset - PAGE_SIZE);
  };

  const toggleEntry = (index) => {
    setTags(tags.map((element, i) => {
      if (index === i) {
        const newElement = element;
        newElement.import = !element.import;
        return newElement;
      }
      return element;
    }));
  };

  const massUpdate = (newValue) => {
    setTags(tags.map((tag) => {
      const newTag = tag;
      newTag.import = newValue;
      return newTag;
    }));
  };

  const userSelector = useSelector((state) => state.user);
  const { token } = userSelector.user;

  const doTagUpdate = async () => {
    setLoading(true);
    try {
      for (const tag of tags) {
        if (tag.import === true && !tag.alreadyExists) {
          // eslint-disable-next-line no-await-in-loop
          await (await fetch('/api/Tag', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${token}`,
            },
            body: JSON.stringify({ name: tag.name }),
          })).json();
        }
      }
      nextState();
    } catch (e) {
      fail(`Javascript error: ${e.toString()}`);
    }
  };

  return (
    <WizardContainer>
      <h1>Select tags to import</h1>
      <p>
        In this step,
        you will select which tags you need to describe your data properly.
        Selected tags will be added to this site.
      </p>
      <div>
        <NavigationContainer>
          <LoadingButton text="Select none" onClick={() => { massUpdate(false); }} loading={false} />
          <LoadingButton text="Select all" onClick={() => { massUpdate(true); }} loading={false} />
        </NavigationContainer>
        <TagListContainer>
          {
              tags.slice(offset, offset + PAGE_SIZE).map((tag, index) => (
                <TagEntry
                  index={index + offset}
                  toggleEntry={toggleEntry}
                  tag={tag}
                  key={tag.name}
                />
              ))
          }
        </TagListContainer>
        <center>
          <p>
            Page
            {(offset / PAGE_SIZE) + 1}
            {' '}
            of
            {Math.ceil(tags.length / PAGE_SIZE)}
          </p>
        </center>
        <NavigationContainer>
          <LoadingButton text="Previous" onClick={prevPage} loading={false} />
          <LoadingButton text="Next" onClick={nextPage} loading={false} />
        </NavigationContainer>
        <LoadingButton text="Import selected tags and go to next stage" onClick={doTagUpdate} loading={loading} />
      </div>
    </WizardContainer>
  );
};


SelectTagsScreen.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    import: PropTypes.bool.isRequired,
    alreadyExists: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  nextState: PropTypes.func.isRequired,
  setTags: PropTypes.func.isRequired,
};
