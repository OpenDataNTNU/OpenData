import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { ReleaseStateLabel } from '../../sharedComponents/ReleaseStateLabel';
import commentsIcon from '../../assets/ui/chat_hollow.svg';
import linkIcon from '../../assets/ui/external_link.svg';
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
const CommentsIcon = styled.a`
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
  & > img {
    height: 1.3rem;
    margin-right: 1.0rem;
  }
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

const StarFullStyled = styled(StarFull)`
  width: 1.4rem;
  color: #5d5d5d;
`;
const StarEmptyStyled = styled(StarEmpty)`
  width: 1.4rem;
  color: #5d5d5d;
`;

const SingleMetaDataResult = ({ metadata }) => {
  const {
    uuid, formatName, url, description, releaseState, metadataTypeName, experiencePostGuid,
  } = metadata;

  const dispatch = useDispatch();
  const hasFeedback = experiencePostGuid !== null;

  // TODO: Fetch comments count
  const commentsCount = 0;

  // TODO: Fix backend for favouriting.
  const isFavourite = false;

  const handleFavourite = async () => {
    try {
      // eslint-disable-next-line no-irregular-whitespace
      const userSelector = useSelector((state) => state.user);
      const { token } = userSelector.user;
      await fetch(`/api/SOMETHING-FOR-ADDING-FAVOURITE/${uuid}/${token}`);
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
          <img src={linkIcon} alt="Open in new tab" />
        </URLWrapper>
      </MetaDataContent>
      <MetaDataRating>
        <Favourite onClick={handleFavourite}>
          {isFavourite ? <StarFullStyled /> : <StarEmptyStyled />}
          <p>Interesting</p>
        </Favourite>
        <CommentsIcon href={`viewData/dataset/${uuid}`}>
          <img src={commentsIcon} alt="Comments" />
          <p>{`${commentsCount} comments`}</p>
        </CommentsIcon>
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
