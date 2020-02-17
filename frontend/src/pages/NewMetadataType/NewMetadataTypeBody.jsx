import React, { useState } from 'react';
import styled from 'styled-components';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';

import { useGetTags } from '../../sharedComponents/hooks/GetTags';

const Wrapper = styled.form`
  flex: 1;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-content: space-around;
`;

const Input = styled.input`
  flex: 0 0 2em;
  margin: 0.5em 1em;
`;

const TextArea = styled.textarea`
  flex: 0 0 10em;
  margin: 0.5em 1em;
`;

const Select = styled(Multiselect)`
  & > .rw-widget-picker > div {
    display: flex;
    align-items: center;
    & > ul > li {
      margin-top 0px;
    }
  }
`;

export const NewMetadataTypeBody = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const tags = useGetTags();
  // const [submissionStatus, setSubmissionStatus] = useState('');
  return (
    <Wrapper>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <Select data={tags || []} placeholder="Tags" />
    </Wrapper>
  );
};
