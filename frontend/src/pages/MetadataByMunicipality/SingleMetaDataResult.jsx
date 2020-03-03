import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { Bubbles } from 'styled-icons/icomoon/Bubbles';
import { Link as LinkIcon } from 'styled-icons/icomoon/Link';
import { ReleaseStateLabel } from '../../sharedComponents/ReleaseStateLabel';
import { alertActions } from '../../state/actions/alert';
import { FeedbackLabel } from './FeedbackLabel';

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

const URLWrapper = styled.a`
  display: flex;
  background-color: #d8e3ff;
  font-size: 0.9rem;
  color: #434faf;
  margin: 0;
  height: 2.0rem;
  align-content: center;
  align-items: center;
`;
const URL = styled.p`
  font-size: inherit;
  flex: 1;
  margin: 0 0 0 0.5rem;
  padding: 0;
`;
const DataFormat = styled.p`
  margin: 0 0 0 1.0rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.8rem;
  border: solid 0.1em #434faf;
  border-radius: 0.3rem;
`;
const LinkIconStyled = styled(LinkIcon)`
  height: 1.3rem;
  margin-right: 1.0rem;
  color: #434faf
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
  const dispatch = useDispatch();
  const hasFeedback = experiencePostGuid !== null;

  const [likes, setLikes] = useState(0);
  const [isLiked, setLiked] = useState(false);

  useState(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/Metadata/${uuid}/likes`);
        const { likeCount, liked } = await res.json();
        setLikes(likeCount);
        setLiked(liked);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not fetch likes for dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch likes. Please try again later.'));
        }
      }
    };
    internal();
  }, []);

  const handleLike = async () => {
    try {
      // eslint-disable-next-line no-irregular-whitespace
      const userSelector = useSelector((state) => state.user);
      const { token } = userSelector.user;
      await fetch(`/api/SOMETHING-FOR-ADDING-LIKE/${uuid}/${token}`);
    } catch (err) {
      dispatch(alertActions.error('Something went wrong when adding/removing favourite.'));
    }
  };
  return (
    <SingleMetaDataResultContainer>
      <MetaDataContent>
        <MetaDataDescription>
          <ReleaseStateLabel releaseState={releaseState} />
          <MetaDataTypeLink to={`/viewData/dataType/${metadataTypeName}`}>
            <h2>{metadataTypeName}</h2>
          </MetaDataTypeLink>
          <FeedbackLabel hasFeedback={hasFeedback} />
          <p>{description}</p>
          <MetaDataLink to={`viewData/dataset/${uuid}`}>
            Other municipalities who offer this data
          </MetaDataLink>
        </MetaDataDescription>
        <URLWrapper href={url} target="_blank">
          <DataFormat>{formatName}</DataFormat>
          <URL>{url}</URL>
          <LinkIconStyled />
        </URLWrapper>
      </MetaDataContent>
      <MetaDataRating>
        <Favourite onClick={handleLike}>
          {isLiked ? <StarFullStyled /> : <StarEmptyStyled />}
          <p>{likes}</p>
        </Favourite>
        <CommentsLink to={`viewData/dataset/${uuid}`}>
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
