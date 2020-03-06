import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bubbles } from 'styled-icons/icomoon/Bubbles';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import { MetadataURL } from '../../sharedComponents/Metadata/MetadataURL';
import { ReleaseStateLabel } from '../../sharedComponents/Metadata/ReleaseStateLabel';
import { alertActions } from '../../state/actions/alert';
import { FeedbackLabel } from '../../sharedComponents/Metadata/FeedbackLabel';

const SingleMetaDataResultContainer = styled.div`
  margin: 0.5rem;
  border: solid 0.2em #F7F9FA;
  border-radius: 0.5rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
  max-width: 100%;
  box-shadow: 0 0.1rem 0.25rem #dbdbdb; 
`;
const MetaDataContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0.3rem;
  background-color: white;
  overflow: hidden;
  max-width: 100%;
`;
const MetaDataTypeLink = styled(Link)`
  & > h2 {
    margin: 0.2em 0;
  }
`;
const MetaDataDescription = styled.div`
  flex-grow: 1;
  padding: 0.5rem;
  color: #313131;
  overflow: hidden;
  max-width: 100%;
  & > p {
    word-wrap: break-word;
    position: relative;
  }
  
`;
const MetaDataLink = styled(Link)`
  padding: 0.4rem;
  display: inline-block;
  background-color: #efd8ff;
  border-radius: 0.2rem;
  margin: 0.2em 0;
  color: rebeccapurple;
`;
const MetaDataRating = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0.4rem;
  background-color: #F7F9FA;
`;
const CommentsLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;

  & > p {
    font-size: 0.8rem;
    max-width: 6rem;
    text-align: center;
  }
  & > img {
    max-width: 1.4rem;
  }
`;
const Favourite = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  & > p {
    font-size: 0.8rem;
    max-width: 6rem;
    text-align: center;
  }
`;
const CommentsIcon = styled(Bubbles)`
  width: 1.4rem;
  color: #5d5d5d;
`;
const StarFullStyled = styled(StarFull)`
  width: 1.4rem;
  color: #f9d205;
`;
const StarEmptyStyled = styled(StarEmpty)`
  width: 1.4rem;
  color: #5d5d5d;
`;

const SingleMetaDataResult = ({ metadata }) => {
  const {
    uuid, formatName, url, description, releaseState, metadataTypeName, experiencePostGuid,
  } = metadata;

  // TODO: Update this to use API whenever that exists.
  const commentsCount = 0;
  const hasFeedback = experiencePostGuid !== null;

  const dispatch = useDispatch();
  const [likes, setLikes] = useState(0);
  const [isLiked, setLiked] = useState(false);
  const userSelector = useSelector((state) => state.user) || { user: { token: { token: null } } };
  const { user: token } = userSelector;

  useState(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/Metadata/${uuid}/like`, {
          method: 'GET',
          headers: {
            Authorization: `bearer ${token.token}`,
          },
        });
        const { likeCount, liked } = await res.json();
        setLikes(likeCount);
        setLiked(liked);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not fetch likes for dataset.'));
        } else if (status === 401) {
          dispatch(alertActions.error('Not authorized to see likes for dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch likes. Please try again later.'));
        }
      }
    };
    internal();
  }, []);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/Metadata/${uuid}/like`, {
        method: 'PUT',
        headers: {
          Authorization: `bearer ${token.token}`,
        },
      });
      const { status } = res;
      if (status === 200) {
        setLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      } else if (status === 401) {
        dispatch(alertActions.error('You must be signed in to like that dataset!'));
      }
    } catch (err) {
      dispatch(alertActions.error('Something went wrong when adding/removing star.'));
    }
  };
  return (
    <SingleMetaDataResultContainer>
      <MetaDataContent>
        <MetaDataDescription>
          <ReleaseStateLabel releaseState={releaseState} />
          <MetaDataTypeLink to={`/dataType/${metadataTypeName}`}>
            <h2>{metadataTypeName}</h2>
          </MetaDataTypeLink>
          <FeedbackLabel hasFeedback={hasFeedback} />
          <p>{description}</p>
          <MetaDataLink to={`/dataset/${uuid}`}>Other municipalities who offer this data</MetaDataLink>
        </MetaDataDescription>
        <MetadataURL url={url} formatName={formatName} />
      </MetaDataContent>
      <MetaDataRating>
        <Favourite onClick={handleLike}>
          {isLiked ? <StarFullStyled /> : <StarEmptyStyled />}
          <p>{likes}</p>
        </Favourite>
        <CommentsLink to={`/dataset/${uuid}`}>
          <CommentsIcon />
          <p>{`${commentsCount} comments`}</p>
        </CommentsLink>
      </MetaDataRating>
    </SingleMetaDataResultContainer>
  );
};

SingleMetaDataResult.propTypes = {
  metadata: PropTypes.shape({
    uuid: PropTypes.string,
    formatName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string,
  }).isRequired,
};

export {
  SingleMetaDataResult,
};
