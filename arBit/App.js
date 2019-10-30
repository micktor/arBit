import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView, Text, Alert} from 'react-native';

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

  toggleCreateModal = () => {
    this.setState({...this.state, displayCreate: !this.state.displayCreate});
  };

  render() {
    return (
      <Container style={styles.container}>
        <View>
          <Text style={styles.title}>arBit</Text>
        </View>
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
    padding: 30,
  },

  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 50,
  },

  button: {
    marginTop: 50,
  },
});
