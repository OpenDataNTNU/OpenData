import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'styled-icons/fa-solid/FileUpload';

const fadeOut = keyframes`
  from {
    transform: scaleY(1);
    opacity: 1;
  }

  to {
    transform-origin: top center;
    transform: scaleY(0) translate(0, -100%);
    opacity: 0;
  }
`;

const Upload = styled.div`
  position: relative;
  padding: 40px 20px;
  width: 100%;
  box-sizing: content-box;
  border: 2px #e6e6e6 solid;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  outline: ${(props) => (props.isHoveringDropArea ? 'none' : null)};
  border-color: ${(props) => (props.isHoveringDropArea ? '#9ecaed' : null)};
  box-shadow: ${(props) => (props.isHoveringDropArea ? '#0 0 10px #9ecaed' : null)};

  display: ${(props) => (props.animationOver ? 'none' : 'flex')};
  transform: ${(props) => (props.hidden ? 'scaleY(0)' : 'scaleY(1)')};
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};
  animation: ${(props) => (props.hidden ? fadeOut : null)} 1s linear;
  transition: visibility 1s linear;
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

const FileDropper = ({ uploadFile, hidden }) => {
  const [isHoveringDropArea, setIsHoveringDropArea] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animationOver, setAnimationOver] = useState(false);

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

  const onAnimationOver = () => {
    setAnimationOver(true);
  };

  return (
    <Upload
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      isHoveringDropArea={isHoveringDropArea}
      hidden={hidden}
      animationOver={animationOver}
      onAnimationEnd={onAnimationOver}
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
  hidden: PropTypes.string.isRequired,
};

export {
  FileDropper,
};
