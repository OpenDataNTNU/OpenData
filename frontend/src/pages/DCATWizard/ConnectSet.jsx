import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Url } from './Url';

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

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem 0.3rem 0.4rem 0.3rem;
  flex: 1;
  background-color: white;
`;

const Info = styled.div`
  flex: 1;
`;

const Connecter = styled.div`
  margin-left: 8px;
`;

const Select = styled.select`
  max-width: 136px;
`;

const Title = styled.p`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Urls = styled.div`
  
`;

const ConnectSet = ({
  id, title, distributions, selectOptions, onSelect, value,
}) => {
  const onChange = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    const { text } = e.nativeEvent.target[index];
    onSelect(id, [text, e.target.value]);
  };

  return (
    <Wrapper>
      <Content>
        <Info>
          <Title>{ title }</Title>
          {
            distributions && distributions.length > 0
              ? (
                <p>
                  Urls:
                </p>
              )
              : null
          }
          <Urls>
            {
              distributions && distributions.map(({ format, description, url }) => (
                <Url
                  key={url + description}
                  format={format}
                  description={description}
                  url={url}
                />
              ))
            }
          </Urls>
        </Info>
        <Connecter>
          <Select onChange={onChange} value={value ? value[1] : ''}>
            <option disabled value=""> -- select an option -- </option>
            {
              selectOptions && selectOptions.map((catalog) => (
                <option key={catalog} value={catalog[1]}>{catalog[0]}</option>
              ))
            }
          </Select>
        </Connecter>
      </Content>
    </Wrapper>
  );
};

ConnectSet.defaultProps = {
  selectOptions: [],
  value: '',
};

ConnectSet.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  distributions: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    format: PropTypes.arrayOf(PropTypes.shape({
      '@id': PropTypes.string.isRequired,
    })).isRequired,
    length: PropTypes.number.isRequired,
    map: PropTypes.func.isRequired,
  })).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export {
  ConnectSet,
};
