import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { Book } from 'styled-icons/icomoon/Book';
import { ReleaseStateLabel } from '../../sharedComponents/ReleaseStateLabel';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  max-width: 50rem;
  background-color: white;
  border-radius: 0.3rem;
  padding: 0;
  margin: 1rem 0.5rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const MetadataContent = styled.div`
  padding: 1rem;
  flex: 1;
`;
const MetadataToolbar = styled.div`
  padding: 0.5rem;
  background-color: #F7F9FA;
  border-top: solid 0.1rem #dfe2ee; 
  display: flex;
`;

const DateLine = styled.p`
  font-size: 0.8rem;
  color: dimgray;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #353535;
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9rem;
  padding: 0.1rem 0.7rem;
  display: inline-block;
  border-radius: 1rem;
  margin: 0.3rem;
`;

const Source = styled.a`
  margin: 0.5rem;
  display: flex;
  flex-direction: row;
`;

const FileFormat = styled.div`
  background-color: #d8e3ff;
  margin-left: 0.4rem;
  padding: 0 1rem;
  color: #434faf;
`;

const FavouriteButton = styled.button`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  background-color: #ffefc5;
  border: solid 0.1rem #d5ad4e;
  padding: 0;
  border-radius: 2.0rem;
  cursor: pointer;
  & > p {
    font-size: 0.8rem;
    max-width: 6rem;
    text-align: center;
    color: #b47b38;
    padding: 0 0.5rem 0 0.3rem;
  }
  &:hover {
    background-color: #fff7d8;
  }
`;
const LikeCounter = styled.div`
  border-left: solid 0.1rem #d5ad4e;
  padding: 0.3rem 0.7rem 0.3rem 0.4rem;
  font-size: 0.9rem;
  color: #b47b38;
`;

const StarFullStyled = styled(StarFull)`
  height: 1.2rem;
  color: #b47b38;
  padding: 0.3rem;
`;
const StarEmptyStyled = styled(StarEmpty)`
  height: 1.2rem;
  color: #b47b38;
  padding: 0.3rem;
`;

const FeedbackLink = styled(Link)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  background-color: #cee0ff;
  border: solid 0.1rem #759ed5;
  padding: 0;
  border-radius: 2.0rem;
  cursor: pointer;
  margin: 0 0.5rem;
  & > p {
    font-size: 0.8rem;
    text-align: center;
    color: #6082af;
    padding: 0 0.5rem 0 0.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover {
    background-color: #deedff;
  }
`;
const FeedbackIcon = styled(Book)`
  height: 1.2rem;
  color: #6082af;
  padding: 0.3rem;
`;

const WriteFeedbackLink = styled(Link)`
  margin-left: 0.5rem;
  font-size: 0.8rem;
`;

export const MetaData = (props) => {
  const { data, tags, description } = props;
  const date = '20-09-2019';

  const {
    uuid, municipalityName, formatName, url, metadataTypeName, experiencePostGuid, releaseState,
  } = data;
  const dispatch = useDispatch();

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
    <Wrapper>
      <MetadataContent>
        <ReleaseStateLabel releaseState={releaseState} />
        <h2>
          Showing metadata about dataset
          {` ${metadataTypeName} from ${municipalityName}`}
        </h2>
        <DateLine>
          Published
          {` ${date}`}
        </DateLine>
        <Description>
          {description}
        </Description>
        <div>
          {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
        <div>
          <Source href={url}>
            {`[${url}]`}
            <FileFormat>
              <p>
                {formatName}
              </p>
            </FileFormat>
          </Source>
        </div>
      </MetadataContent>
      <MetadataToolbar>
        <FavouriteButton onClick={handleLike}>
          {isLiked ? <StarFullStyled /> : <StarEmptyStyled />}
          <p>Interesting</p>
          <LikeCounter>{likes}</LikeCounter>
        </FavouriteButton>
        <div>
          {
            experiencePostGuid
              ? (
                <FeedbackLink to={`/articles/${experiencePostGuid}`}>
                  <FeedbackIcon />
                  <p>Experience Article</p>
                </FeedbackLink>
              )
              : <WriteFeedbackLink to={`/articles/new/${uuid}`}>Are you the owner of this data set? Write an experience article here</WriteFeedbackLink>
        }
        </div>
      </MetadataToolbar>
    </Wrapper>
  );
};

MetaData.defaultTypes = {
  uuid: '',
};

MetaData.propTypes = {
  data: PropTypes.shape({
    municipalityName: PropTypes.string.isRequired,
    formatName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string,
    uuid: PropTypes.string,
  }).isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};
