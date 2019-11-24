import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {db} from './db';
import {Container, Input, Item, Button, Label} from 'native-base';

export default class CreateScreen extends Component {
  state = {
    roomName: '',
    roomList: [],
  };

  static navigationOptions = {
    title: 'Login',
    headerLeft: null
  };

  addRoom(room) {
    db.child(room).push({});
    db.child('Events/' + room + '/roominfo').set({
      users: 0,
      numbervoted: 0,
      submitted: 0,
      winner: '',
    });
  }

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
  toggleNameModal = () => {
    const {navigate} = this.props.navigation;
    var found = this.state.roomList.includes(this.state.roomName);

    if (found) {
      alert(
        'Room is already created, please create another room or join this one',
      );
    } else if (this.state.roomName != '') {
      this.addRoom(this.state.roomName);
      navigate('AddPerson', {
        roomName: this.state.roomName,
        roomList: this.state.roomList,
      });
    } else alert('Please Enter Room Name');
  };

  constructor(props) {
    super(props);
  }

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container style={createModalStyle.container}>
        <View>
          <Item style={createModalStyle.bigBlack}>
            <Label>Enter Room Name: </Label>
            <Input
              onChangeText={this.handleRoomName}
              style={createModalStyle.text}
            />
          </Item>
          <Button
            title="Enter"
            onPress={() => this.toggleNameModal()}
            style={createModalStyle.button}
            full
            rounded
            success>
            <Text>Enter</Text>
          </Button>

          <Button
            style={createModalStyle.button}
            onPress={() => navigate('Home')}
            style={createModalStyle.button}
            full
            rounded
            danger>
            <Text>Cancel</Text>
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
