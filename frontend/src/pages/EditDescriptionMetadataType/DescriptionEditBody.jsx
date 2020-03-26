import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions } from '../../state/actions/alert';

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
  border: solid 0.1rem #d8d8d8;
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin: 0.5rem;
  & > h3 {
    margin: 0;
    padding: 0.3rem 0;
    border-bottom: solid 0.2rem lightgrey;
  }
`;
const Suggestion = styled.div`
  padding: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: row;
  border-left: solid 0.4rem #eeeeee;
  border-radius: 0.2rem;
  margin-bottom: 0.3rem;
  & > p {
    flex: 1;
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
  const userSelector = useSelector((state) => state.user);
  const [loadingType, setLoadingType] = useState(true);
  const [loadingDescriptions, setLoadingDescriptions] = useState(true);
  const { token } = userSelector.user;
  const dispatch = useDispatch();

  useEffect(() => {
    const loadMetadataType = async () => {
      setLoadingType(true);
      // TODO: Add fetching for description suggestions
      try {
        // FIXME: Add correct API url
        const res = await fetch(`/api/metadatatype/${uuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
        const receivedMetadataType = await res.json();
        setMetadataType(receivedMetadataType);
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
      // TODO: Add fetching for description suggestions
      try {
        // FIXME: Add correct API url
        const res = await fetch(`/api/metadatatype/${uuid}/description`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
        const receivedDescriptions = await res.json();
        setDescriptions(receivedDescriptions);
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
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { target } = evt;
    const descriptionText = target[0].value;
    if (descriptionText) {
      try {
        // FIXME: Add correct API url
        const res = await fetch(` /api/metadatatype/${uuid}/description`, {
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

  const handleVote = async (duuid) => {
    try {
      const res = await fetch(`PUT /api/metadatatype/${uuid}/description/${duuid}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
    } catch (err) {
      const { status } = err;
      if (status === 402) {
        dispatch(alertActions.error('Something went wrong while voting for that description - please try to log out and back in'));
      } else if (status === 500) {
        dispatch(alertActions.error('Something went wrong while processing vote for that description - please try again later'));
      } else {
        dispatch(alertActions.error('Something went wrong while processing vote for that description.'));
      }
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
        <p>{metadataType.description}</p>
      </TypeHeader>
      <DescriptionsContainer>
        <h3>Suggested descriptions:</h3>
        { descriptions.length === 0
          ? <p><i>Nobody has submitted any other descriptions.</i></p>
          : descriptions.map(({ text, votes, duuid }) => (
            <Suggestion>
              <p>{text}</p>
              <div>
                <p>{votes}</p>
                <button type="button" onClick={() => handleVote(duuid)}>Upvote</button>
              </div>
            </Suggestion>
          ))}
      </DescriptionsContainer>
      <Form onSubmit={handleSubmit}>
        <DescriptionField type="text" placeholder="New description" name="inp-description" />
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
