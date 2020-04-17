import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Template } from '../../sharedComponents/Template';
import { RootLevelCategorySelector } from '../NewMetadataType/RootLevelCategorySelector';
import { alertActions } from '../../state/actions/alert';

const Background = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 960px;
  margin: auto;
  box-sizing: border-box;

  @media screen and (max-width: 960px) {
    padding: 5px;
  }
`;

const Form = styled.form`
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

export const NewCategory = () => {
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState(undefined);
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  const submit = async (e) => {
    e.preventDefault();
    if (!name) {
      dispatch(alertActions.error('Please enter a name for the new category'));
      return;
    }
    if (parentCategory === undefined) {
      dispatch(alertActions.error('Please choose a parent category (or "[No category]", if this is not a subcategory)'));
      return;
    }
    try {
      const { token } = userSelector.user;
      const { ok, status } = await fetch('/api/MetadataCategory', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          parentUuid: parentCategory || null,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
      dispatch(alertActions.success('Successfully submitted category. Redirecting in 3 seconds.'));
    } catch (err) {
      const { status } = err;
      if (status === 401) {
        dispatch(alertActions.error('Unauthorized to create a new category'));
      } else {
        dispatch(alertActions.error('An unexpected error occurred while creating a new category.'));
      }
    }
  };

  if (redirect) {
    return <Redirect to="/newMetadataType" />;
  }

  return (
    <Template>
      <Background>
        <Form onSubmit={submit}>
          <h2>
            Create a new category
          </h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name for new category" />
          <RootLevelCategorySelector nullable title="Parent category:" onChange={(e) => setParentCategory(e.target.value)} />
          <input type="submit" value="Submit" />
        </Form>
      </Background>
    </Template>
  );
};
