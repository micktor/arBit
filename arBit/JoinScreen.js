// DisplayModal.js

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {db} from './db';
import {Container, Input, Item, Button, Label} from 'native-base';

export default class JoinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomList: [],
    };
  }

  static navigationOptions = {
    title: 'Login',
  };

  componentDidMount() {
    db.once('value').then(snapshot => {
      const data = snapshot.val();
      if (data != null) {
        this.setState({roomList: Object.keys(data.Events)});
      }
    });

    db.on('child_changed', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.setState({roomList: Object.keys(data)});
      }
    });
  }

  toggleJoinModal = () => {
    const {navigate} = this.props.navigation;
    var found = this.state.roomList.includes(this.state.roomName);

    if (!found) {
      alert('Room has not been created yet!');
    } else {
      navigate('AddPerson', {
        roomName: this.state.roomName,
        roomList: this.state.roomList,
      });
    }
  };

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container style={createModalStyle.container}>
        <View>
          <Item style={createModalStyle.bigBlack}>
            <Label>Enter room to Join: </Label>
            <Input
              onChangeText={this.handleRoomName}
              style={createModalStyle.text}
            />
          </Item>
          <Button
            title="Join"
            onPress={() => this.toggleJoinModal()}
            style={createModalStyle.button}
            full
            rounded
            success>
            <Text>Join</Text>
          </Button>
          <Button
            style={createModalStyle.button}
            onPress={() => navigate('Home')}
            full
            rounded
            danger>
            <Text>Close</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const createModalStyle = StyleSheet.create({
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
