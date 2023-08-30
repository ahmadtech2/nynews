import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

test('renders correctly', () => {
  const { getByText, getByTestId } = render(<HomeScreen />);
  // Test whether a specific element with a testID exists
  expect(getByTestId('flat-list')).toBeTruthy();
});
