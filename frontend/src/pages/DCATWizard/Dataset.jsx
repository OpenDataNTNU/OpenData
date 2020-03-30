import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0.4rem 0px;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
  max-width: 100%;
  box-shadow: 0 0.05rem 0.2rem #d1d1d1;
`;

const SelectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F7F9FA;
  border-right: solid 0.1rem #dfe1e2;
`;

const Content = styled.div`
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
  flex: 1;
  background-color: white;
`;

const Description = styled.p`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Link = styled.a`
  color: darkorchid;
`;

const Formats = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const Format = styled.span`
  margin: 0px 5px 5px 0px;
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Dataset = ({
  index, selected, onSelect, description, format: formats, url,
}) => {
  const onChange = () => {
    onSelect(index);
  };

  return (
    <Wrapper>
      <SelectionWrapper>
        <input type="checkbox" checked={selected} onChange={onChange} />
      </SelectionWrapper>
      <Content>
        <Description>
          <Link href={url} target="_blank">
            {
              description
            }
          </Link>
        </Description>
        <Formats>
          {
            formats && formats.length > 0
              ? (
                formats.map((format) => (
                  <Format key={format['@id']}>{ format['@id'] }</Format>
                ))
              )
              : null
          }
        </Formats>
      </Content>
    </Wrapper>
  );
};

Dataset.propTypes = {
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  format: PropTypes.arrayOf(PropTypes.shape({
    '@id': PropTypes.string.isRequired,
  })).isRequired,
  url: PropTypes.string.isRequired,
};

export {
  Dataset,
};
