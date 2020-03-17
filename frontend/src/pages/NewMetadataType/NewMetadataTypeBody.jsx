import React, { useState } from 'react';
import styled from 'styled-components';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { alertActions } from '../../state/actions/alert';
import { useGetTags } from '../../sharedComponents/hooks/GetTags';
import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-content: space-around;
  max-width: 30em;
  min-width: 20em;
  padding: 1em;
  margin: 10px 0px;
  background-color: white;
  border-radius: 4px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const Input = styled.input`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
  border-radius: 4px;
  color: black;
  border: 1px solid darkgray;
`;

const TextArea = styled.textarea`
  min-height: 150px;
  resize: vertical;
  margin-bottom: 5px;
  font-size: 16px;
  border-radius: 4px;
  color: black;
  border: 1px solid darkgray;
`;

const Select = styled(Multiselect)`
  & > .rw-widget-picker > div {
    display: flex;
    align-items: center;
    & > ul > li {
      margin-top: 0px;
    }
  }
`;

export const NewMetadataTypeBody = () => {
  const allTags = useGetTags();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
    } catch (err) {
      const { request } = err;
      if (request === 'initial') {
        dispatch(alertActions.error('Failed to create a new data type'));
      } else if (request === 'tags') {
        dispatch(alertActions.error('Something went wrong while adding tags to this data type'));
      } else {
        dispatch(alertActions.error('An unknown error occurred while creating this data type'));
      }
      setLoading(false);
    }
  };

  if (submissionStatus === 'success') {
    return <Redirect to="/sendData" />;
  }

  return (
    <Wrapper>
      <Form onSubmit={submit}>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <Select data={allTags || []} value={tags} onChange={setTags} placeholder="Tags" />
        <LoadingButton text="submit" type="value" loading={loading} onClick={() => {}} />
      </Form>
    </Wrapper>
  );
};
