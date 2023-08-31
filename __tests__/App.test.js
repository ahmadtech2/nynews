/**
 * @format
 */

import 'react-native';

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  test('renders without errors', () => {
    render(<App />);
  });
});
