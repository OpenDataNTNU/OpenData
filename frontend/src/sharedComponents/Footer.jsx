import React from 'react';
import styled from 'styled-components';

const FooterHTML = styled.footer`
  background-color: #efefef;
  color: dimgray;
`;

const Container = styled.div`
  max-width: 40em;
  margin: auto;
  padding: 2em;
`;

const Link = styled.a`
  text-decoration: underline;
`;

const Footer = () => (
  <FooterHTML>
    <Container>
      <p>
        OpenData is an open source data catalogue developed at the
        Norwegian University of Technology and Science in Trondheim, Norway.
      </p>
      <p>
        <Link href="https://github.com/OpenDataNTNU/OpenData">
          Source code on GitHub
        </Link>
      </p>
    </Container>
  </FooterHTML>
);

export {
  Footer,
};
