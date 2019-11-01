// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
import AddPersonModal from './addPersonModal';
import {db} from './db';
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

export default class CreateModal extends Component {
  state = {
    roomName: '',
    displayName: false,
  };
  addRoom(room) {
    db.child(room).push({});
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
    var found = this.state.roomList.includes(this.state.roomName);
    if (found) {
      alert(
        'Room is already created, please create another room or join this one',
      );
    } else if (this.state.roomName != '') {
      this.addRoom(this.state.roomName);
      this.setState({...this.state, displayName: !this.state.displayName});
    } else alert('Please Enter Room Name');
  };
  
  constructor(props) {
    super(props);
  }

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  render() {
    return (
      <Modal
        visible={this.props.displayCreate}
        animationType="slide"
        onRequestClose={() => console.log('closed')}>
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
            <AddPersonModal
              displayName={this.state.displayName}
              toggleNameModal={this.toggleNameModal}
              roomName={this.state.roomName}
            />
            <Button
              style={createModalStyle.button}
              onPress={() => this.props.toggleCreateModal()}
              style={createModalStyle.button}
              full
              rounded
              danger>
              <Text>Cancel</Text>
            </Button>
          </View>
        </Container>
      </Modal>
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
