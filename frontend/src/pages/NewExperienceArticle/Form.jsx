import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Multiselect from 'react-widgets/lib/Multiselect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-widgets/dist/css/react-widgets.css';
import styled from 'styled-components';

import { history } from '../../router/history';
import { Input } from '../../sharedComponents/Input';
import { alertActions } from '../../state/actions/alert';
import { useGetTags } from '../../sharedComponents/hooks';

const StyledForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  width: 100%;
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
  min-height: 300px;
  height: 100%;
  max-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;

  & > .ql-container {
    height: auto;
    flex: 1;
    overflow: auto;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: .875rem;
  line-height: 2.25rem;
  font-weight: 500;
  letter-spacing: .0892857143em;
  text-decoration: none;
  text-transform: uppercase;
  padding: 0 8px 0 8px;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: #66bb6a;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0.0625em 0.125em;

  &:hover {
    ${(props) => (props.disabled ? null : 'background-color: #98ee99')};
  }

  &:active {
    background-color: #338a3e;
  }
`;

const Form = () => {
  // Redux
  const dispatch = useDispatch();

  // State
  const [title, setTitle] = useState('');
  let tagsData = useGetTags();
  tagsData = tagsData || [];
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState('');

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

    // Fetch url
    const url = '/api/Tag';

    // Article data
    const data = {
      title,
      tags,
      body,
    };

    try {
      // Fetch request => returns response
      const response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      });

      // Submit feedback that the article was successfully submitted
      if (response.ok && response.status === 200) {
        dispatch(alertActions.success('Article successfully submitted. Redirecting in 3 seconds.'));

        // Get article ID
        const responseData = await response.json();

        const redirectUrl = `/articles/${responseData.id}`;

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
          <Quill id="Article" modules={modules} value={body} onChange={(text) => setBody(text)} />
        </label>
      </InputWrapper>
      <Button disabled={title === '' || !title}>
        Submit Article
      </Button>
    </StyledForm>
  );
};

export {
  Form,
};
