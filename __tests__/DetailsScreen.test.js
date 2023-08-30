import React from 'react';
import { render } from '@testing-library/react-native';
import DetailsScreen from '../src/screens/DetailsScreen';

const mockRoute = {
  params: {
    article: {
      title: 'Sample Article',
      media: [{ 'media-metadata': [{ url: 'sample-url' }] }],
      abstract: 'Sample abstract',
      byline: 'Sample Author',
      published_date: '2023-08-29',
    },
  },
};

test('renders correctly', () => {
  const { getByText, getByTestId } = render(<DetailsScreen route={mockRoute} />);
  
  // Test whether the component renders some specific text/content
  expect(getByText('Sample Article')).toBeTruthy();
  
  // Test whether a specific element with a testID exists
  expect(getByTestId('article-image')).toBeTruthy();
});
