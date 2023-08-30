import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import { View } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const HomeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'NY Times Most Viewed',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="menu-outline" // Use the appropriate icon name from the library
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <View style={{flexDirection:'row'}}>
              <Icon
                name="search-outline" // Use the appropriate icon name from the library
                size={24}
                color="white"
                style={{ marginRight: 10 }}
                onPress={() => {
                  // Implement search functionality here
                }}
              />
              <Icon
                name="ellipsis-vertical" // Use the appropriate icon name from the library
                size={24}
                color="white"
                style={{ marginRight: 10 }}
                onPress={() => {
                  // Implement search functionality here
                }}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#52e3c4', // Set header background color
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'white'
        }}
      />
       <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerTitle: 'Article Details',
          headerTitleAlign: 'center',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#52e3c4',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'white',
          headerBackImage: () => (
            <Icon
              name="arrow-back-outline" // Use the appropriate icon name from the library
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
            />
          ),
          headerBackTitleVisible: false, // Hide the "Back" text
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
