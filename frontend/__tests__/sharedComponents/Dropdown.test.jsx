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

    // The dropdown component should be rendered
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

    // Click the dropdown component
    await wait(() => {
      fireEvent(
        getByText('Navigation'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    // The elements in the dropdown list should be rendered after the click
    let listElement = queryByText('Test list element');
    expect(listElement).toBeInTheDocument();

    // Click the dropdown component
    await wait(() => {
      fireEvent(
        getByText('Navigation'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    // The elements in the dropdown list should not be rendered
    // anymore after clicking it for a second time
    listElement = queryByText('Test list element');
    expect(listElement).not.toBeInTheDocument();
  });
});
