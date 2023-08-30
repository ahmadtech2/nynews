module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  moduleNameMapper: {
    '^@react-navigation/elements$': '<rootDir>/__mocks__/react-navigation-elements.js',
    "@react-navigation(.*)": "<rootDir>/__mocks__/@react-navigation.js",
    "react-native-gesture-handler": "<rootDir>/__mocks__/react-native-gesture-handler.js",
    "react-navigation-drawer": "<rootDir>/__mocks__/react-navigation-drawer.js"
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@?react-native|@?@?react-navigation|@?react-native-reanimated)/)',
  ],
  // transformIgnorePatterns: [
  //   'node_modules/(?!react-native|@react-navigation|@react-native-community|@react-navigation/.*|@react-native-reanimated|)',
  // ],
};
