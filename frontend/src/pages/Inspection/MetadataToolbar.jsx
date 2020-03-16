import React, { useState } from 'react';
import styled from 'styled-components';
import { Link as InnerLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { StarEmpty } from 'styled-icons/icomoon/StarEmpty';
import PropTypes from 'prop-types';

import { alertActions } from '../../state/actions/alert';
import { FeedbackLink } from './FeedbackLink';

const MetadataToolbarContainer = styled.div`
  padding: 0.5rem;
  background-color: #F7F9FA;
  border-top: solid 0.1rem #dfe2ee; 
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
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
  min-width: 1.3rem;
  text-align: center;
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

const WriteLink = styled(InnerLink)`
  font-size: 0.8rem;
`;

const MetadataToolbar = ({ uuid, experiencePosts, municipalityName }) => {
  const dispatch = useDispatch();
  const [likes, setLikes] = useState(0);
  const [isLiked, setLiked] = useState(false);
  const userSelector = useSelector((state) => state.user);
  const { user } = userSelector || { user: null };
  const {
    token,
    municipalityName: userMunicipalityName,
  } = user || { token: null, municipalityName: null };

  useState(() => {
    const internal = async () => {
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
          Authorization: `bearer ${token}`,
        },
      });
      const { status } = res;
      if (status === 200) {
        setLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      } else if (status === 401) {
        dispatch(alertActions.info('You must be signed in to like that dataset!'));
      }
    } catch (err) {
      dispatch(alertActions.error('Something went wrong when adding/removing star.'));
    }
  };

  return (
    <MetadataToolbarContainer>
      <FavouriteButton onClick={handleLike}>
        {isLiked ? <StarFullStyled /> : <StarEmptyStyled />}
        <p>Interesting</p>
        <LikeCounter>{likes}</LikeCounter>
      </FavouriteButton>
      <FeedbackLink
        uuid={uuid}
        experiencePosts={experiencePosts}
        municipalityName={municipalityName}
        userMunicipalityName={userMunicipalityName}
      />
      {
        [municipalityName === userMunicipalityName
          ? <WriteLink key={`/articles/new/${uuid}`} to={`/articles/new/${uuid}`}>Write an experience article here.</WriteLink>
          : null,
        ]
      }
    </MetadataToolbarContainer>
  );
};
MetadataToolbar.propTypes = {
  uuid: PropTypes.string.isRequired,
  experiencePosts: PropTypes.arrayOf(PropTypes.shape({
    experiencePostUuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  municipalityName: PropTypes.string.isRequired,
};
MetadataToolbar.defaultProps = {
  experiencePosts: [],
};
export {
  MetadataToolbar,
};
