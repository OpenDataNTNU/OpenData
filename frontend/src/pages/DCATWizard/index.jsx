import React from 'react';
import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'styled-icons/fa-solid/FileUpload';

import { Template } from '../../sharedComponents/Template';
// import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: #efefef;
`;

const Content = styled.div`
  width: 80%;
  height: 80%;
  min-width: 500px;
  min-height: 300px;
  background-color: #ffffff;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 40% 60%;
`;

const Uploader = styled.div`
  padding: 20px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`

`;

const Upload = styled.div`
  max-height: 100%;
  height: 100%;
  box-sizing: content-box;
  border: 2px #e6e6e6 solid;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`

`;

const UploadText = styled.span`
  margin-left: 5px;
  color: #1291ff;
`;

const ExtensionText = styled.span`
  margin-left: 5px;
`;

const DCATWizard = () => {
  const onDragOver = () => {

  };

  const onDrop = () => {

  };

  return (
    <Template>
      <Wrapper>
        <Content>
          <Uploader>
            <Header>DCAT Wizard</Header>
            <Upload onDragOver={onDragOver} onDrop={onDrop}>
              <Label>
                <FileUpload size="1em" />
                <UploadText>Add file</UploadText>
              </Label>
              <Input type="file" accept="image/*" />
              <ExtensionText>or drop file here</ExtensionText>
            </Upload>
          </Uploader>
        </Content>
      </Wrapper>
    </Template>
  );
};

export {
  DCATWizard,
};
