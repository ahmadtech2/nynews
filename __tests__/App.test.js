/**
 * @format
 */

import 'react-native';
// import React from 'react';
// import App from '../App';

// // Note: import explicitly to use the types shiped with jest.
// import {it} from '@jest/globals';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

// import React from 'react';
// import { render } from '@testing-library/react-native';
// import App from '../App';

// test('renders correctly', () => {
//   const { getByTestId } = render(<App />);
  
//   // Test whether a specific element with a testID exists
//   expect(getByTestId('drawer-navigation')).toBeTruthy();
// });
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  test('renders without errors', () => {
    render(<App />);
  });
});
