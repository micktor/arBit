// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
// import {Button} from 'react-native-elements';
import {addRoom} from './roomService';
import AddPersonModal from './addPersonModal';

import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem } from 'native-base'


export default class CreateModal extends Component {
  state = {
    roomName: '',
    displayName: false,
  };

  toggleNameModal = () => {
    if (this.state.roomName != '') {
      addRoom(this.state.roomName);
      this.setState({...this.state, displayName: !this.state.displayName});
    } else alert('Please Enter Room Name');

  }

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
              <Label>Name: </Label>
              <Input
              onChangeText={this.handleRoomName}
              style={createModalStyle.text}
              />
            </Item>
            <Button title="Enter" onPress={() => this.toggleNameModal()} style={createModalStyle.button} full rounded success>
            <Text>Enter</Text>
            </Button>
            <AddPersonModal
              displayName={this.state.displayName}
              toggleNameModal={this.toggleNameModal}
            />
            <Button
              style={createModalStyle.button}
              title="Cancel"
              onPress={() => this.props.toggleCreateModal()} style={createModalStyle.button} full rounded danger>
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
    marginTop: 50
  }
});
