import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'styled-icons/fa-solid/FileUpload';

const Upload = styled.div`
  position: relative;
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

const TooltipText = styled.span`
  visibility: ${(props) => (props.showTooltip ? 'visible' : 'hidden')};
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: Calc(100% + 10px);
  left: 50%;
  margin-left: -100px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

const FileDropper = ({ uploadFile }) => {
  const [isHoveringDropArea, setIsHoveringDropArea] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      isHoveringDropArea={isHoveringDropArea}
    >
      <Label>
        <FileUpload size="1em" />
        <UploadText>Add file</UploadText>
        <Input type="file" accept=".jsonld,.xml,.rdf" onChange={onChange} />
      </Label>
      <ExtensionText>or drop file here</ExtensionText>
      <TooltipText showTooltip={showTooltip}>
        Accepted file formats are: .jsonld, .xml, and .rdf
      </TooltipText>
    </Upload>
  );
};

FileDropper.propTypes = {
  uploadFile: PropTypes.func.isRequired,
};

export {
  FileDropper,
};
