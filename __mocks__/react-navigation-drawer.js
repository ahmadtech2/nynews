import React from 'react';

const mockCreateDrawerNavigator = jest.fn(() => {
  const DrawerNavigator = ({ children }) => <div>{children}</div>;
  const DrawerScreen = ({ children }) => <div>{children}</div>;

  return {
    Navigator: DrawerNavigator,
    Screen: DrawerScreen,
  };
});

export { mockCreateDrawerNavigator };