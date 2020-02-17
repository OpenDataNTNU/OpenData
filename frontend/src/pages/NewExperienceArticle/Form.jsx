import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Multiselect from 'react-widgets/lib/Multiselect';
import DropdownList from 'react-widgets/lib/DropdownList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-widgets/dist/css/react-widgets.css';
import styled from 'styled-components';

import { history } from '../../router/history';
import { Input } from '../../sharedComponents/Input';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
import { alertActions } from '../../state/actions/alert';
import { useGetTags, useGetMetadata, useGetMetadatas } from '../../sharedComponents/hooks';

const StyledForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  width: 100%;
  margin: 10px 0px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;

  & > input {
    padding-left: 15px;
  }
`;

const StyledMultiSelect = styled(Multiselect)`
  & > .rw-widget-picker > div {
    display: flex;
    align-items: center;

    & > ul > li {
      margin-top 0px;
    }
  }
`;

const Quill = styled(ReactQuill)`
  min-height: 200px;
  height: 100%;
  max-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;

  & > .ql-container {
    height: auto;
    flex: 1;
    overflow: auto;
  }
`;

const Form = () => {
  // React router dom
  const { id } = useParams();

  // Redux
  const dispatch = useDispatch();

  // State
  const [title, setTitle] = useState('');
  // Get tags from backend
  let tagsData = useGetTags();
  // if it returns null then set it to an empty array for app to not crash
  tagsData = tagsData || [];
  // Only fetch metadata info if the id isn't null
  const metadataInfo = id ? useGetMetadata(id) : null;
  // Fetch all metadatas if the id is null for the dropdown selector
  let metadatas = !id ? useGetMetadatas() : [];
  // Only show onces that isnt connected to an article
  // map the uuid as we only need that (should be name once we get that)
  metadatas = metadatas ? metadatas.filter((m) => !m.experiencePostGuid).map((m) => m.uuid) : [];
  const [metadataId, setMetadataId] = useState('');
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Quilljs toolbar config
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }], // eslint-disable-line quote-props
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // On article submit
  const onSubmit = async (e) => {
    // Prevent default behavior for forms
    e.preventDefault();
    setLoading(true);

    // Fetch url
    const articleUrl = `/api/Metadata/${id || metadataId}/experience`;

    // Article data
    const articleData = {
      title,
      contents: content,
    };

    // Try to submit article
    try {
      // Fetch request for the article
      const articleResponse = await fetch(articleUrl, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(articleData),
      });

      // If the article submission was OK
      if (articleResponse.ok && articleResponse.status === 200) {
        // Get response data
        const articleResponseData = await articleResponse.json();
        // Set tags url
        const tagsUrl = `/api/ExperiencePost/${articleResponseData.experiencePost.uuid}/tag`;
        // Try to submit Tags
        try {
          const labelResponses = await Promise.all(tags.map((tag) => fetch(tagsUrl, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({ name: tag }),
          })));

          // Check if the tags submission was OK
          for (const labelResponse of labelResponses) { // eslint-disable-line no-restricted-syntax
            if (!labelResponse.ok || labelResponse.status !== 200) {
              // If it wasnt throw an error
              throw new Error(labelResponse.statusText);
            }
          }
        } catch (error) {
          // Give user feedback that the label(s) submission failed and wait 5s.
          dispatch(alertActions.error('Failed to submit label(s)'));
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        // Submit userfeedback that the article was submitted successfully
        dispatch(alertActions.success('Article successfully submitted. Redirecting in 3 seconds.'));

        const redirectUrl = `/articles/${articleResponseData.experiencePost.uuid}`;

        // Redirect to article
        setTimeout(() => history.push(redirectUrl),
          3000);
      } else {
        dispatch(alertActions.error('Failed to submit article.'));
      }
    } catch (_) {
      dispatch(alertActions.error('Failed to submit article.'));
    }
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      <InputWrapper>
        <label htmlFor="title">
          Title:
          <Input name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="dataset">
          Dataset:
          {
            id
              ? (
                /*
                  I know i can just uuid, but this stays here
                  until we get a name that describes the dataset
                */
                <Input
                  name="dataset"
                  id="dataset"
                  disabled
                  value={metadataInfo ? metadataInfo.uuid : ''}
                />
              )
              : (
                <DropdownList
                  id="dataset"
                  data={metadatas}
                  value={metadataId}
                  onChange={(value) => setMetadataId(value)}
                />
              )
          }
        </label>
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="Tags">
          Tags:
          <StyledMultiSelect
            id="Tags"
            data={tagsData}
            value={tags}
            onChange={(value) => setTags(value)}
          />
        </label>
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="Article">
          Article:
          <Quill id="Article" modules={modules} value={content} onChange={(text) => setContent(text)} />
        </label>
      </InputWrapper>
      <LoadingButton text="Submit Article" loading={loading} disabled={title === '' || !title} />
    </StyledForm>
  );
};

export {
  Form,
};
