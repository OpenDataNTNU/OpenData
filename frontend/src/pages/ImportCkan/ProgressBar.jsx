import styled from 'styled-components';

export const ProgressBar = styled.div.attrs((props) => ({
  style: {
    width: `${props.progress * 100}%`,
  },
}))`
  height: 2em;
  background-color: #aaffaa;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  position: relative;
  >p {
    position: absolute;
    top: 0;
  }
`;
