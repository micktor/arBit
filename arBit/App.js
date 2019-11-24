import {createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './HomeScreen';
import CreateScreen from './CreateScreen';
import JoinScreen from './JoinScreen';

import { createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Create: {screen: CreateScreen},
  Join: {screen: JoinScreen}
});

const App = createAppContainer(MainNavigator);

export default App;