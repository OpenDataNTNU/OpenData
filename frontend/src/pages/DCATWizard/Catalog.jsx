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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.p`
  color: #3e3e3e;
  font-size: 0.9rem;
  background-color: #f2f2f2;
  border-radius: 0.2rem;
  padding: 0.2rem;
  display: inline-block;
`;

const Select = styled.select`
  max-width: 136px;
`;

const Catalog = ({
  selected, onSelect, title, categories, onCategorySelect,
}) => {
  const onChange = () => {
    onSelect(title);
  };

  const onCategorySelectChange = (e) => {
    onCategorySelect(title, e.target.value);
  };

  return (
    <Wrapper>
      <SelectionWrapper>
        <input type="checkbox" checked={selected} onChange={onChange} />
      </SelectionWrapper>
      <Content>
        <Title>
          {
            title
          }
        </Title>
        <Select onChange={onCategorySelectChange}>
          {
              categories && categories.map((category) => (
                <>
                  <option key={category.uuid} value={category.uuid}>{category.name}</option>
                  {
                      category.types.map((type) => (
                        <option key={type.uuid} value={type.uuid}>{type.name}</option>
                      ))
                    }
                </>
              ))
            }
        </Select>
      </Content>
    </Wrapper>
  );
};

Catalog.defaultProps = {
  categories: [],
};

const Type = {
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    tagName: PropTypes.string.isRequired,
    metadataTypeUuid: PropTypes.string.isRequired,
  }))),
  description: PropTypes.string.isRequired,
  metadataList: PropTypes.arrayOf(),
  categoryUuid: PropTypes.string.isRequired,
};

Type.types = PropTypes.arrayOf(Type);

const Child = {
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  types: PropTypes.arrayOf(Type),
};

Child.children = PropTypes.arrayOf(Child);

Catalog.propTypes = {
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    lastEdited: PropTypes.string.isRequired,
    hasChildren: PropTypes.bool.isRequired,
    hasTypes: PropTypes.bool.isRequired,
    parentUuid: PropTypes.string,
    children: PropTypes.arrayOf(Child),
    types: PropTypes.arrayOf(PropTypes.shape(Type)).isRequired,
  })),
  onCategorySelect: PropTypes.func.isRequired,
};

export {
  Catalog,
};
