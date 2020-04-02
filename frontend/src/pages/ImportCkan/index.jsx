import React, { useState } from 'react';
import styled from 'styled-components';

import { useGetTags } from '../../sharedComponents/hooks/GetTags';

import { Template } from '../../sharedComponents/Template';
import { LoadFromCkanScreen } from './LoadFromCkanScreen';
import { SelectTagsScreen } from './SelectTagsScreen';
import { SelectGroupsScreen } from './SelectGroupsScreen';

const OuterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

export const ImportCkan = () => {
  const [importedTags, setTagsInner] = useState([]);
  const [groups, setGroups] = useState([]);
  const [state, setState] = useState(0);
  const nextState = () => {
    setState(state + 1);
  };

  const existingTags = useGetTags() || [];

  const setTags = (newTags) => {
    setTagsInner(newTags.map((tag) => ({
      name: tag,
      alreadyExists: (existingTags.indexOf(tag.toLowerCase()) !== -1),
      import: true,
    })));
  };

  const updateGroup = (updateIndex, newValue) => {
    setGroups(groups.map((value, index) => (index === updateIndex ? newValue : value)));
  };

  let pageContents = (<p>Please wait while we are fetching some required data...</p>);

  if (existingTags.length > 0) {
    if (state === 0) {
      pageContents = (
        <LoadFromCkanScreen
          setTags={setTags}
          setGroups={setGroups}
          nextState={nextState}
        />
      );
    } else if (state === 1) {
      pageContents = (
        <SelectTagsScreen
          tags={importedTags}
          nextState={nextState}
          setTags={setTagsInner}
        />
      );
    } else if (state === 2) {
      pageContents = (
        <SelectGroupsScreen
          groups={groups}
          updateGroup={updateGroup}
          nextState={nextState}
        />
      );
    } else {
      pageContents = (
        <div>
          <h1>Import completed</h1>
          <p>You have now imported everything. Go check it out!</p>
          <p>
            View your data --&gt;
            <a href="/myData">My data</a>
          </p>
        </div>
      );
    }
  }

  return (
    <Template>
      <OuterContainer>
        {
          pageContents
        }
      </OuterContainer>
    </Template>
  );
};
