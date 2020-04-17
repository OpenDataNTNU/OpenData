import React from 'react';
import { useParams } from 'react-router-dom';

import { Template } from '../../sharedComponents/Template';
import { SingleCategory } from './SingleCategory';
import { TopLevelCategories } from './TopLevelCategories';

export const Category = () => {
  const { uuid } = useParams();
  return (
    <Template>
      {uuid
        ? <SingleCategory uuid={uuid} />
        : <TopLevelCategories />}
    </Template>
  );
};
