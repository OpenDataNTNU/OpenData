import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AngleDown as ReactAngleDown } from 'styled-icons/fa-solid/AngleDown';
import { AngleUp as ReactAngleUp } from 'styled-icons/fa-solid/AngleUp';

const Wrapper = styled.div`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
      user-select: none;
  position: relative;
  width: fit-content;
  height: fit-content;
  color: #000;
`;

const Header = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  line-height: 38px;
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  cursor: default;
  position: relative;
  background-color: #fff;
`;

const Title = styled.div`
  font-weight: 300;
  margin: 2px 20px;
  margin-right: 30px;
`;

const AngleDown = styled(ReactAngleDown)`
  margin-right: auto; 
`;

const AngleUp = styled(ReactAngleUp)`
  margin-right: auto; 
`;

const List = styled.ul`
  z-index: 10;
  position: absolute;
  width: 100%;
  border: 1px solid #dfdfdf;
  border-top: none;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 5px -1px #e8e8e8;
          box-shadow: 0 2px 5px -1px #e8e8e8;
  font-weight: 700;
  padding: 0px;
  max-height: 215px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;

const ListItem = styled.li`
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  line-height: 1.6rem;
  cursor: default;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: auto;

  &:not(:last-child) {
    border-bottom: 0.5px solid lightgrey;
  }
`;

const Dropdown = ({ title, list, onItemClick }) => {
  // State
  const [open, setOpen] = useState(false);

  // List open toggle function
  const toggleList = () => {
    setOpen(!open);
  };

  // Call callback with item title
  const onClick = (e) => {
    // The dataset id is the title of the list item
    onItemClick(e.target.dataset.id);
    // Close list, this is necessary if they try to go to the same page as they are on
    // as nothing will re-render and the list will stay open
    setOpen(false);
  };

  return (
    <Wrapper>
      <Header onClick={toggleList}>
        <Title>
          {title}
        </Title>
        {
          open
            ? <AngleUp size="2em" />
            : <AngleDown size="2em" />
        }
      </Header>
      {
        open
        && (
          <List>
            {
              list.map((item) => (
                <ListItem key={item.id} data-id={item.title} onClick={onClick}>
                  {item.title}
                </ListItem>
              ))
            }
          </List>
        )
      }
    </Wrapper>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export {
  Dropdown,
};
