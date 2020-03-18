import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Bubbles } from 'styled-icons/icomoon/Bubbles';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import { MetadataURL } from './MetadataURL';
import { alertActions } from '../../state/actions/alert';
import { ReleaseStateLabel } from './ReleaseStateLabel';

const ContentExpandedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  flex: 1;
`;
const ContentCollapsedWrapper = styled.div`
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
  flex: 1;
  background-color: white;
`;

const CollapsedLink = styled(Link)`
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const MetaDataContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  max-width: 100%;
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

const SmallLink = styled(Link)`
  & > p {
    color: #3e3e3e;
    font-size: 0.9rem;
    background-color: #f2f2f2;
    border-radius: 0.2rem;
    padding: 0.2rem;
    display: inline-block;
  }
`;
const MetaDataLink = styled(Link)`
  padding: 0.4rem;
  display: inline-block;
  background-color: #efd8ff;
  border-radius: 0.2rem;
  margin: 0.2rem 0;
  color: rebeccapurple;
`;
const MetaDataRating = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0.4rem;
  background-color: #F7F9FA;
  border-left: solid 0.1rem #dfe1e2;
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

const ContentCollapsed = ({ metadata, showCategory, showMunicipality }) => {
  const {
    uuid, description, releaseState, municipalityName, metadataTypeName,
  } = metadata;
  return (
    <ContentCollapsedWrapper>
      <div>
        <ReleaseStateLabel compact releaseState={releaseState} />
        { showMunicipality ? (
          <SmallLink to={`/municipalities/${municipalityName}`}>
            <p>{municipalityName}</p>
          </SmallLink>
        ) : null }
        { showCategory ? (
          <SmallLink to={`/dataType/${metadataTypeName}`}>
            <p>{metadataTypeName}</p>
          </SmallLink>
        ) : null }
      </div>
      <div>
        <CollapsedLink to={`/dataset/${uuid}`}>{description}</CollapsedLink>
      </div>
    </ContentCollapsedWrapper>
  );
};
const ContentExpanded = ({ metadata, showCategory, showMunicipality }) => {
  const {
    uuid, formatName, url, description, releaseState,
    municipalityName, metadataTypeName,
  } = metadata;

  // TODO: Update this to use API whenever that exists.
  const [commentsCount, setCommentsCount] = useState(0);
  const dispatch = useDispatch();
  const [likes, setLikes] = useState(0);
  const [isLiked, setLiked] = useState(false);
  const userSelector = useSelector((state) => state.user);
  const { user } = userSelector || { user: null };
  const { token } = user || { token: null };

  useEffect(() => {
    const getLikes = async () => {
      try {
        const res = await fetch(`/api/Metadata/${uuid}/like`, {
          method: 'GET',
          headers: {
            Authorization: `bearer ${token}`,
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
          dispatch(alertActions.info('Not authorized to see likes for dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch likes. Please try again later.'));
        }
      }
    };
    const getComments = async () => {
      try {
        const res = await fetch(`/api/Comment/metadata/${uuid}`);
        const comments = await res.json();
        setCommentsCount(comments.length);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not fetch comments count for dataset.'));
        } else if (status === 401) {
          dispatch(alertActions.info('Not authorized to see comments count for dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch comments count. Please try again later.'));
        }
      }
    };
    getLikes();
    getComments();
  }, []);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/Metadata/${uuid}/like`, {
        method: 'PUT',
        headers: {
          Authorization: `bearer ${token}`,
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
    <ContentExpandedWrapper>
      <MetaDataContent>
        <MetaDataDescription>
          <ReleaseStateLabel releaseState={releaseState} />
          { showMunicipality ? (
            <SmallLink to={`/municipalities/${municipalityName}`}>
              <p>{municipalityName}</p>
            </SmallLink>
          ) : null }
          { showCategory ? (
            <SmallLink to={`/dataType/${metadataTypeName}`}>
              <p>{metadataTypeName}</p>
            </SmallLink>
          ) : null }

          <p>{description}</p>
          <MetaDataLink to={`/dataset/${uuid}`}>See full entry</MetaDataLink>
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
          <p>{`${commentsCount} threads`}</p>
        </CommentsLink>
      </MetaDataRating>
    </ContentExpandedWrapper>
  );
};
ContentExpanded.propTypes = {
  metadata: PropTypes.shape({
    uuid: PropTypes.string,
    formatName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    municipalityName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string,
  }).isRequired,
  showCategory: PropTypes.bool,
  showMunicipality: PropTypes.bool,
};
ContentExpanded.defaultProps = {
  showCategory: false,
  showMunicipality: false,
};
ContentCollapsed.propTypes = {
  metadata: PropTypes.shape({
    uuid: PropTypes.string,
    formatName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    municipalityName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string,
  }).isRequired,
  showCategory: PropTypes.bool,
  showMunicipality: PropTypes.bool,
};
ContentCollapsed.defaultProps = {
  showCategory: false,
  showMunicipality: false,
};

export {
  ContentExpanded,
  ContentCollapsed,
};
