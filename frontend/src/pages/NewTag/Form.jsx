import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ArrowLeftS } from 'styled-icons/remix-fill/ArrowLeftS';

import { useGetTags } from '../../sharedComponents/hooks/GetTags';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const StyledForm = styled.form`
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

const TagsLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: fit-content;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
  border-radius: 4px;
  color: black;
  border: ${(props) => (props.valid ? '1px solid springgreen' : '1px solid orangered')};
  border: ${(props) => (props.empty ? '1px solid darkgray' : null)};
  outline-color: transparent;
  outline-style: none;
`;

const Form = () => {
  // Router
  const history = useHistory();

  // Redux
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { token } = userSelector.user;

  // State
  const allTags = useGetTags() || [];
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  // Update input teext
  const onChange = (e) => {
    setTag(e.target.value);
  };

  // Only allow tags with letters
  const validateTag = (_tag) => {
    const re = /^[a-åA-Å\s]*$/;
    return re.test(_tag);
  };

  // Check if the tag already exists
  const checkIfTagExists = (_tag) => {
    for (const exsistingTag of allTags) {
      if (exsistingTag.toLowerCase() === _tag.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  // Check if the tag exists and follows the correct pattern and
  // sets the border color according to tat
  const checkTag = () => {
    if (!validateTag(tag) || checkIfTagExists(tag)) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  // Check tag every time it's changed
  useEffect(() => {
    checkTag();
  }, [tag]);

  // Submit tag to backend on submit
  const onSubmit = async (e) => {
    e.preventDefault();

    // Start the loading icon
    setLoading(true);

    // Remove whitespace on ends
    const trimmedTag = tag.trim();

    // Check if it follows the patterns
    if (!validateTag(trimmedTag)) {
      dispatch(alertActions.error('Tags can only contain letters'));
      return setValid(false);
    }

    // Check if it exists
    if (checkIfTagExists(trimmedTag)) {
      dispatch(alertActions.error('The tag already exists.'));
      return setValid(false);
    }

    // Try to push it to the server
    try {
      const response = await fetch('/api/Tag', {
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
          name: trimmedTag,
        }),
      });

      // Not okey throw error else
      // set tag to empty string, stop loading, dispatch message and start tiem out for redirect
      if (!response.ok || response.status !== 200) {
        throw new Error();
      } else {
        setTag('');
        dispatch(alertActions.success('Successfully submitted tag. Redirecting in 5 seconds.'));
        setTimeout(() => {
          history.push('/tags');
        }, 5000);
      }
    } catch (_) {
      dispatch(alertActions.error('Failed to submit tag.'));
    }
    return setLoading(false);
  };

  return (
    <Wrapper>
      <StyledForm onSubmit={onSubmit}>
        <TagsLink to="/tags">
          <ArrowLeftS size="1em" />
          <span>Tags</span>
        </TagsLink>
        <StyledInput type="text" value={tag} placeholder="New Tag" onChange={onChange} valid={valid} empty={tag === ''} required />
        <LoadingButton text="submit" type="value" loading={loading} onClick={() => {}} />
      </StyledForm>
    </Wrapper>
  );
};

export {
  Form,
};
