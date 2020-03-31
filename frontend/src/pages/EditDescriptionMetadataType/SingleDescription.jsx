import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Upvote as UVFilled } from 'styled-icons/boxicons-solid/Upvote';
import { Upvote as UVHollow } from 'styled-icons/boxicons-regular/Upvote';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  font-size: 0.9rem;
  display: flex;
  flex-direction: row;
  border: solid 0.1rem #eeeeee;
  border-radius: 0.2rem;
  margin-bottom: 0.3rem;
  overflow: hidden;
`;
const DescriptionHeader = styled.div`
  padding: 0.3rem 0.5rem;
  color: dimgray;
  display: flex;
  flex-direction: row;
  & p {
    font-size: 0.8rem;
  }
`;
const TimeStamp = styled.div`
  margin-left: auto;
  text-align: right;
  position: relative;
  flex: 1;
  & > p {
    visibility: hidden;
    display: none;
    position: absolute;
    right: 0;
    top: 0;
  }
  & > i {
    visibility: visible;
    display: block;
  }
  &:hover > i {
    visibility: hidden;
  }
  &:hover > p {
    display: block;
    visibility: visible;
  }
`;
const DescriptionMain = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;
const DescriptionContent = styled.div`
  flex: 1;
  & > p {
    padding: 0.5rem;
    margin: 0;
  }
`;
const DescriptionVotes = styled.div`
  background-color: #F7F9FA;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-items: center;
  align-self: center;
  height: 100%;
  border-left: solid 0.1rem #eeeeee;
  & > p {
    margin: 0.5rem;
  }
`;
const UpvoteIcon = styled(UVHollow)`
  width: 1.2rem;
  height: 1.2rem;
  color: dimgray;
`;
const RemoveVoteIcon = styled(UVFilled)`
  width: 1.2rem;
  height: 1.2rem;
  color: #6aab5c;
`;
const VoteButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0.5rem;
  cursor: pointer;
`;

const SingleDescription = ({ typeUuid, description, forceReloader }) => {
  const {
    author, content, edited, hasVoted, uuid, voteCount,
  } = description;
  const userSelector = useSelector((state) => state.user);
  const { token } = userSelector.user;
  const dispatch = useDispatch();

  const handleVote = async () => {
    try {
      const res = await fetch(`/api/MetadataType/${typeUuid}/description/${uuid}/vote`, {
        method: hasVoted ? 'DELETE' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { ok, status } = res;
      if (status === 200) {
        forceReloader(); // Re-fetch descriptions after successful vote change.
      }
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
  const timeSince = (timeString) => {
    const timeZoneOffset = 2; // The database is two hours ahead for some reason
    const then = new Date(timeString);
    const seconds = Math.floor(((new Date() - then) / 1000) - timeZoneOffset * 3600);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `${interval} years`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} days`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} hours`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes`;
    }
    return `${Math.floor(seconds)} seconds`;
  };

  return (
    <Wrapper>
      <DescriptionMain>
        <DescriptionContent>
          <DescriptionHeader>
            <p>{`${author.mail} from ${author.municipalityName}`}</p>
            <TimeStamp>
              <i>{`${timeSince(edited)} ago`}</i>
              <p>{new Date(edited).toString()}</p>
            </TimeStamp>
          </DescriptionHeader>
          <p>{content}</p>
        </DescriptionContent>
      </DescriptionMain>
      <DescriptionVotes>
        <p>{voteCount}</p>
        <VoteButton type="button" onClick={handleVote}>
          { hasVoted ? <RemoveVoteIcon /> : <UpvoteIcon /> }
        </VoteButton>
      </DescriptionVotes>
    </Wrapper>
  );
};

SingleDescription.propTypes = {
  description: PropTypes.shape({
    author: PropTypes.shape({
      mail: PropTypes.string,
      municipalityName: PropTypes.string,
    }),
    content: PropTypes.string,
    edited: PropTypes.string, // Time on the format "YYYY-MM-DDTHH:MM:SS.ssssss"
    hasVoted: PropTypes.bool,
    uuid: PropTypes.string,
    voteCount: PropTypes.number,
  }).isRequired,
  typeUuid: PropTypes.string.isRequired,
  forceReloader: PropTypes.func.isRequired,
};

export {
  SingleDescription,
};
