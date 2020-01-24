import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Dropdown } from '../../src/sharedComponents/Dropdown';

describe('Dropdown component', () => {
  it('should render the component', async () => {
    const { queryByText } = render(
      <Dropdown
        title="Navigation"
        onItemClick={() => {}}
        list={[]}
      />,
    );

    const linkElement = queryByText(/Navigation/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('should show and hide the dropdown list on click', async () => {
    const { getByText, queryByText } = render(
      <Dropdown
        title="Navigation"
        onItemClick={() => {}}
        list={[{ id: 'Test list element', title: 'Test list element' }]}
      />,
    );

    await wait(() => {
      fireEvent(
        getByText('Navigation'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    let listElement = queryByText('Test list element');
    expect(listElement).toBeInTheDocument();

    await wait(() => {
      fireEvent(
        getByText('Navigation'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    listElement = queryByText('Test list element');
    expect(listElement).not.toBeInTheDocument();
  });
});
