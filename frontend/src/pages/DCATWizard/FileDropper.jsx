import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'styled-icons/fa-solid/FileUpload';

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
  outline: ${(props) => (props.isHoveringDropArea ? 'none' : null)};
  border-color: ${(props) => (props.isHoveringDropArea ? '#9ecaed' : null)};
  box-shadow: ${(props) => (props.isHoveringDropArea ? '#0 0 10px #9ecaed' : null)};
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

const FileDropper = ({ uploadFile }) => {
  const [isHoveringDropArea, setIsHoveringDropArea] = useState(false);

  const onDragOver = (e) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (!isHoveringDropArea) {
      setIsHoveringDropArea(true);
    }
  };

  const onDragLeave = () => {
    setIsHoveringDropArea(false);
  };

  const onDrop = (e) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    // Turn of outline glow when file is dropped
    setIsHoveringDropArea(false);

    uploadFile(e.dataTransfer.items[0].getAsFile());
  };

  const onChange = (e) => {
    e.preventDefault();

    uploadFile(e.target.files[0]);
  };

  return (
    <Upload
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      isHoveringDropArea={isHoveringDropArea}
    >
      <Label>
        <FileUpload size="1em" />
        <UploadText>Add file</UploadText>
        <Input type="file" accept="image/*" onChange={onChange} />
      </Label>
      <ExtensionText>or drop file here</ExtensionText>
    </Upload>
  );
};

FileDropper.propTypes = {
  uploadFile: PropTypes.func.isRequired,
};

export {
  FileDropper,
};
