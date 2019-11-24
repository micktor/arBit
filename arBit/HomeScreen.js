import React, {Component} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Container, Button} from 'native-base';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  componentDidMount = () => {
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
    console.disableYellowBox = true;
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container style={styles.container}>
        <View>
          <Text style={styles.title}>arBit</Text>
        </View>
        <Image
          style={styles.icon}
          source={require('./assets/images/group-icon.png')}
        />
        <View>
          <Button
            onPress={() => navigate('Create')}
            style={styles.button}
            full
            rounded
            success>
            <Text>Create Room</Text>
          </Button>
        </View>
        <View>
          <Button
            onPress={() => navigate('Join')}
            style={styles.button}
            full
            rounded
            success>
            <Text>Join Room</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 5,
  },

  button: {
    marginTop: 50,
    width: 180,
  },

  icon: {
    width: 125,
    height: 125,
    justifyContent: 'center',
  },
});
