import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from 'styled-icons/fa-solid/FileUpload';
import { File } from 'styled-icons/fa-solid/File';

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

const fadeIn = keyframes`
  from {
    transform: scaleY(0) scaleX(0);
    opacity: 0;
  }

  to {
    transform: scaleY(1) scaleX(1);
    opacity: 1;
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

const FinishedUpload = styled.div`
  display: ${(props) => (props.animationOver ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: ${(props) => (props.hidden ? 'scaleY(1)' : 'scaleY(0)')};
  visibility: ${(props) => (props.hidden ? 'visible' : 'hidden')};
  animation: ${(props) => (props.hidden ? fadeIn : null)} 1s linear;
  transition: visibility 1s linear;
`;

const FileDropper = ({ file, setFile, hidden }) => {
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

    setFile(e.dataTransfer.items[0].getAsFile());
  };

  const onChange = (e) => {
    e.preventDefault();

    setFile(e.target.files[0]);
  };

  const onAnimationOver = () => {
    setAnimationOver(true);
  };

  return (
    <>
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
      <FinishedUpload
        hidden={hidden}
        animationOver={animationOver}
      >
        <File size="4em" />
        <p>{file ? file.name : ''}</p>
      </FinishedUpload>
    </>
  );
};

FileDropper.defaultProps = {
  file: {
    name: 'undefined',
    lastModified: (new Date()).getTime(),
    lastModifiedDate: new Date(),
    webkitRelativePath: '',
    size: 0,
    type: '',
  },
};

FileDropper.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    lastModified: PropTypes.number,
    lastModifiedDate: PropTypes.objectOf(Date),
    webkitRelativePath: PropTypes.string,
    size: PropTypes.number,
    typee: PropTypes.string,
  }),
  setFile: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export {
  FileDropper,
};
