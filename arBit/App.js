import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView, Text, Alert, Image} from 'react-native';

import CreateModal from './createModal';
import JoinModal from './joinModal';

import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label,
  List,
  ListItem,
} from 'native-base';

function Separator() {
  return <View style={styles.separator} />;
}

export default class App extends Component {
  state = {
    displayCreate: false,
    displayJoin: false,
  };
  toggleJoinModal = () => {
    this.setState({...this.state, displayJoin: !this.state.displayJoin});
  };
  componentDidMount = () => {
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
    console.disableYellowBox = true;
  }

  toggleCreateModal = () => {
    this.setState({...this.state, displayCreate: !this.state.displayCreate});
  };



  render() {
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
            onPress={() => this.toggleCreateModal()}
            style={styles.button}
            full
            rounded
            success>
            <Text>Create Room</Text>
          </Button>
          <CreateModal
            displayCreate={this.state.displayCreate}
            toggleCreateModal={this.toggleCreateModal}
          />
        </View>
        <View>
          <Button
            onPress={() => this.toggleJoinModal()}
            style={styles.button}
            full
            rounded
            success>
            <Text>Join Room</Text>
          </Button>
          <JoinModal
            displayJoin={this.state.displayJoin}
            toggleJoinModal={this.toggleJoinModal}
          />
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
    justifyContent: "center",
  },
});
