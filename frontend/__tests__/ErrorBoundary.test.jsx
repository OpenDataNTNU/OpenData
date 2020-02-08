import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { ErrorBoundary } from '../src/ErrorBoundary';

test('Error boundary is rendered on error', () => {
  // Test component that will throw an error
  const TEST = () => {
    useEffect(() => {
      throw new Error('hi');
    }, []);
    return (
      <h1>TEST</h1>
    );
  };

  // Render error boundary and test component
  const { getByText } = render(
    <ErrorBoundary>
      <TEST />
    </ErrorBoundary>,
  );

  // Check that error boundary has been rendered
  const errorTitle = getByText('An error has occurred.');
  expect(errorTitle).toBeInTheDocument();
});
