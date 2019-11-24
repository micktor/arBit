import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './HomeScreen';
import CreateScreen from './CreateScreen';
import JoinScreen from './JoinScreen';
import AddPersonScreen from './AddPersonScreen';
import OptionsScreen from './OptionsScreen';
import WinnerScreen from './WinnerScreen'

import {createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Create: {screen: CreateScreen},
  Join: {screen: JoinScreen},
  AddPerson: {screen: AddPersonScreen},
  Options: {screen: OptionsScreen},
  Winner: {screen: WinnerScreen}
});

const App = createAppContainer(MainNavigator);

export default App;