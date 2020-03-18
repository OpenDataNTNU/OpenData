import React, { useState } from 'react';
import styled from 'styled-components';
import { Pencil } from 'styled-icons/icomoon/Pencil';
import { StarFull } from 'styled-icons/icomoon/StarFull';
import { Location } from 'styled-icons/icomoon/Location';
import { NoResult } from '../MetadataByMunicipality/NoResult';
import { MyDataStarred } from './MyDataStarred';
import { MyDataCrossRef } from './MyDataCrossRef';
import { MyDataSubmitted } from './MyDataSubmitted';

const MyDataBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 50em;
  border-radius: 0.3rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-sizing: border-box;
  margin: auto;
  background-color: white;
  flex: 1;
  overflow: hidden;
`;
const PaneSelector = styled.form`
  display: flex;
  border-bottom: 0.1rem lightgray solid;
  background-color: #f9f9f9;
`;
const PaneButton = styled.div`
  padding: 0;
  border-bottom: 0.1em solid lightgray;
  cursor: pointer;
  flex: 1;
  height: 100%;
  
  &:hover {
    background-color: #f2f2f2;
  }
  & > input[type="radio"] {
    display: none;
    width: 0;
    height: 0;
    position: fixed;
  }
  & > label {
    font-size: 1.1rem;
    padding: 0.8rem 0.5rem 0.5rem 0.5rem;
    display: block;
    color: #2d2d2d;
    text-align: center;
    border-bottom: solid 0.3rem rgba(0,0,0,0);
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
  }
  & > input[type="radio"]:checked+label {
    border-bottom: solid 0.3em #a19ae6;
    color: #8983c4;
  }
`;
const Content = styled.div`
  padding: 0.8rem;
`;
const StarFullStyled = styled(StarFull)`
  width: 1.2rem;
  height: 1.2rem;
  color: inherit;
  margin-right: 0.5rem;
`;
const PencilStyled = styled(Pencil)`
  width: 1.2rem;
  height: 1.2rem;
  color: inherit;
  margin-right: 0.5rem;
`;
const CopyStyled = styled(Location)`
  width: 1.2rem;
  height: 1.2rem;
  color: inherit;
  margin-right: 0.5rem;
`;

const MyDataBody = () => {
  const panes = [
    {
      id: 'my-starred',
      name: 'My starred data',
      comp: <MyDataStarred />,
      icon: <StarFullStyled />,
    }, {
      id: 'my-submitted',
      name: 'My submitted data',
      comp: <MyDataSubmitted />,
      icon: <PencilStyled />,
    }, {
      id: 'cross-ref',
      name: 'Cross-referenced data',
      comp: <MyDataCrossRef />,
      icon: <CopyStyled />,
    },
  ];
  const [SelectedComponent, setSelectedComponent] = useState(null);
  const handlePaneSelection = ({ target: { value } }) => {
    setSelectedComponent(panes[value].comp);
  };

  return (
    <MyDataBodyWrapper>
      <PaneSelector>
        { panes.map(({ id, name, icon }, index) => (
          <PaneButton key={id} onChange={handlePaneSelection}>
            <input type="radio" id={`radio-${id}`} name="radio-pane" value={index} />
            <label htmlFor={`radio-${id}`}>
              {icon}
              {name}
            </label>
          </PaneButton>
        ))}
      </PaneSelector>
      <Content>
        { !SelectedComponent
          ? <NoResult text="Select a pane to display." />
          : SelectedComponent}
      </Content>
    </MyDataBodyWrapper>
  );
};

export {
  MyDataBody,
};
