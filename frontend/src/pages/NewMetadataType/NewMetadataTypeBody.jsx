import React, { useState } from 'react';
import styled from 'styled-components';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { alertActions } from '../../state/actions/alert';
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
  const allTags = useGetTags();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState('');

  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token } = userSelector.user;
      const res = await fetch('/api/MetadataType', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          description,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        err.request = 'initial';
        throw err;
      }
      const tagReses = await Promise.all(tags.map((tag) => (
        fetch(`/api/MetadataType/${name}/tag`, {
          method: 'PUT',
          body: JSON.stringify({
            name: tag,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        })
      )));
      for (let i = 0; i < tagReses.length; i += 1) {
        const r = tagReses[i];
        const { ok: tagOk, status: tagStatus } = r;
        if (!tagOk) {
          const err = new Error();
          err.status = tagStatus;
          err.request = 'tag';
        }
      }
      setSubmissionStatus('success');
    } catch (err) {
      const { request } = err;
      if (request === 'initial') {
        dispatch(alertActions.error('Failed to create a new data type'));
      } else if (request === 'tags') {
        dispatch(alertActions.error('Something went wrong while adding tags to this data type'));
      } else {
        dispatch(alertActions.error('An unknown error occurred while creating this data type'));
      }
    }
  };

  if (submissionStatus === 'success') {
    return <Redirect to="/sendData" />;
  }

  return (
    <Wrapper>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <Select data={allTags || []} value={tags} onChange={setTags} placeholder="Tags" />
      <Input type="submit" value="Submit" onClick={submit} />
    </Wrapper>
  );
};
