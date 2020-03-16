import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link as InnerLink } from 'react-router-dom';
import { Book } from 'styled-icons/icomoon/Book';

const Wrapper = styled.div`
  margin: 0px 5px;
`;

const Link = styled(InnerLink)`
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

const DropdownLink = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  background-color: #cee0ff;
  border: solid 2px #759ed5;
  padding: 0;
  border-radius: ${(props) => (props.showDropdown ? '1.0rem 1.0rem 0rem 0rem' : '2.0rem')};
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  -khtml-user-select: none;    /* Konqueror HTML */
  -moz-user-select: none;      /* Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
  & p {
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

const IconWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin: 0 0.5rem;
`;

const Dropdown = styled.div`
  cursor: pointer;
  position: absolute;
  top: 100%;
  width: 100%;
  background-color: #cee0ff;
  border: solid 2px #759ed5;
`;

const InnerDropdownLink = styled.p`
  border-bottom: solid 2px #759ed5;
  margin: 0px;
  padding: 2px !important;

  &:last-child {
    border-bottom: 0px;
  }

  &:hover {
    background-color: #deedff;
  }
`;

const Icon = styled(Book)`
  height: 1.2rem;
  color: #6082af;
  padding: 0.3rem;
`;

const FeedbackLink = ({ experiencePosts }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const onClick = (e) => {
    e.preventDefault();

    setShowDropdown(!showDropdown);
  };

  return (
    <Wrapper>
      {
      experiencePosts && experiencePosts.length > 0
        ? [experiencePosts.length > 1
          ? (
            <DropdownLink showDropdown={showDropdown}>
              <IconWrapper onClick={onClick}>
                <Icon />
                <p>Experience Articles</p>
              </IconWrapper>
              {
                  showDropdown
                    ? (
                      <Dropdown>
                        {
                          experiencePosts.map((experiencePost, index) => (
                            <InnerDropdownLink>
                              <InnerLink to={`/articles/${experiencePost.experiencePostUuid}`}>
                                Article
                                {' '}
                                {index + 1}
                              </InnerLink>
                            </InnerDropdownLink>
                          ))
                        }
                      </Dropdown>
                    )
                    : null
                }
            </DropdownLink>
          )
          : (
            <Link to={`/articles/${experiencePosts[0].experiencePostUuid}`}>
              <Icon />
              <p>Experience Article</p>
            </Link>
          )]
        : null
    }
    </Wrapper>
  );
};

FeedbackLink.propTypes = {
  experiencePosts: PropTypes.arrayOf(PropTypes.shape({
    experiencePostUuid: PropTypes.string.isRequired,
    metadataUuid: PropTypes.string.isRequired,
  })),
};

FeedbackLink.defaultProps = {
  experiencePosts: [],
};

export {
  FeedbackLink,
};
