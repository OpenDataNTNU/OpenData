import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions } from '../../state/actions/alert';
import { SingleDescription } from './SingleDescription';

const Wrapper = styled.div`
  border-radius: 0.3rem;
  border: solid 0.1rem lightgrey;
  padding: 0;
  max-width: 40rem;
  margin: 0.5rem auto;
  background-color: white;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-sizing: border-box;
  overflow: hidden;
`;

const TypeHeader = styled.div`
  color: #494949;
  border-bottom: 0.1rem solid #d6d6d6;
  background-color: #f6f6f6;
  padding: 0.5rem;
  & > h3 {
    margin: 0.3rem 0;
  }
`;
const DescriptionsContainer = styled.div`
  min-height: 5rem;
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  & > h3 {
    margin: 0 0 0.5rem 0;
    padding: 0.3rem 0;
  }
`;
const DescriptionField = styled.textarea`
  padding: 0.5rem;
  font-size: 1.0rem;
  border: none;
  display: block;
  min-height: 4rem;
  box-sizing: border-box;
  min-width: 100%;
  resize: vertical;
  font-family: inherit;
`;

const Form = styled.form`
  font-size: 0.9rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  border: solid 0.1rem #9a85d3;
  border-radius: 0.3rem;
  overflow: hidden;
  margin: 0.5rem;
`;
const SubmitButton = styled.button`
  padding: 0.3rem;
  font-size: 1.0rem;
  color: #70619a;
  background-color: #dcd8ff;
  border: none;
  border-top: solid 0.1rem #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  cursor: pointer;
  
  &:hover {
    background-color: #e8e6ff;
  }
  
`;

const DescriptionEditBody = ({ uuid }) => {
  const [descriptions, setDescriptions] = useState([]);
  const [metadataType, setMetadataType] = useState(null);
  const [descriptionsChanged, setDescriptionsChanged] = useState(0);
  const userSelector = useSelector((state) => state.user);
  const [loadingType, setLoadingType] = useState(true);
  const [loadingDescriptions, setLoadingDescriptions] = useState(true);
  const { token } = userSelector.user;
  const dispatch = useDispatch();

  const forceReloadDescriptions = () => {
    setDescriptionsChanged(descriptionsChanged + 1);
  };

  useEffect(() => {
    const loadMetadataType = async () => {
      setLoadingType(true);
      try {
        const res = await fetch(`/api/MetadataType/${uuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
        const { ok, status } = res;
        if (status === 200) {
          const receivedMetadataType = await res.json();
          if (!receivedMetadataType.description) {
            receivedMetadataType.description = {
              uuid,
              content: 'No description',
            };
          }
          setMetadataType(receivedMetadataType);
        }
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
      } catch (err) {
        const { status } = err;
        if (status === 402) {
          dispatch(alertActions.error('Something went wrong while fetching the data type - please try to log out and back in'));
        } else if (status === 500) {
          dispatch(alertActions.error('Something went wrong while fetching the data type - please try again later'));
        } else {
          dispatch(alertActions.error('Something went wrong while fetching the data type -'));
        }
      }
      setLoadingType(false);
    };
    const loadDescriptions = async () => {
      setLoadingDescriptions(true);
      try {
        const res = await fetch(`/api/MetadataType/${uuid}/description`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
        const { ok, status } = res;
        if (res.status === 200) {
          const receivedDescriptions = await res.json();
          setDescriptions(receivedDescriptions);
        }
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
      } catch (err) {
        const { status } = err;
        if (status === 402) {
          dispatch(alertActions.error('Something went wrong while fetching descriptions - please try to log out and back in'));
        } else if (status === 500) {
          dispatch(alertActions.error('Something went wrong while fetching descriptions - please try again later'));
        } else {
          dispatch(alertActions.error('Something went wrong while fetching descriptions.'));
        }
      }
      setLoadingDescriptions(false);
    };
    loadDescriptions();
    loadMetadataType();
  }, [descriptionsChanged]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { target } = evt;
    const descriptionText = target[0].value;
    if (descriptionText) {
      try {
        const res = await fetch(` /api/MetadataType/${uuid}/description`, {
          method: 'PUT',
          body: JSON.stringify({
            content: descriptionText,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
        const { ok, status } = res;
        if (status === 200) {
          dispatch(alertActions.success('Submitted new description suggestion.'));
          forceReloadDescriptions();
        }
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
      } catch (err) {
        const { status } = err;
        if (status === 402) {
          dispatch(alertActions.error('Something went wrong while validating your login - please try to log out and back in'));
        } else if (status === 500) {
          dispatch(alertActions.error('Something went wrong while processing your new description - please try again later'));
        } else {
          dispatch(alertActions.error('Something went wrong processing your new description.'));
        }
      }
    } else {
      dispatch(alertActions.info('You cannot submit an empty description for a category!'));
    }
  };

  if (loadingType) {
    return (
      <Wrapper>
        <TypeHeader>
          <p><i>Loading data type ...</i></p>
        </TypeHeader>
      </Wrapper>
    );
  }

  if (loadingDescriptions) {
    return (
      <Wrapper>
        <TypeHeader>
          <p><i>Loading suggested descriptions ...</i></p>
        </TypeHeader>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TypeHeader>
        <h3>{metadataType.name}</h3>
        <p>{metadataType.description.content}</p>
      </TypeHeader>
      <DescriptionsContainer>
        <h3>Suggested descriptions:</h3>
        { descriptions.length === 0
          ? <p><i>Nobody has submitted any other descriptions.</i></p>
          : descriptions.map((desc) => (
            <SingleDescription
              key={desc.uuid}
              typeUuid={uuid}
              description={desc}
              forceReloader={forceReloadDescriptions}
            />
          ))}
      </DescriptionsContainer>
      <Form onSubmit={handleSubmit}>
        <DescriptionField type="text" required placeholder="New description" name="inp-description" />
        <SubmitButton type="submit">Submit new description</SubmitButton>
      </Form>
    </Wrapper>
  );
};

DescriptionEditBody.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export {
  DescriptionEditBody,
};
