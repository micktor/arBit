// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import {addRoom} from './roomService';
import AddPersonModal from './addPersonModal';

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
        <View>
          <TextInput
            placeholder="Name"
            onChangeText={this.handleRoomName}
            style={createModalStyle.text}
          />
          <Button title="Enter" onPress={() => this.toggleNameModal()} />
          <AddPersonModal
            displayName={this.state.displayName}
            toggleNameModal={this.toggleNameModal}
          />
          <Button
            style={createModalStyle.button}
            title="Cancel"
            onPress={() => this.props.toggleCreateModal()}
          />
        </View>
      </Modal>
    );
  }
}

const createModalStyle = StyleSheet.create({
  text: {
    fontSize: 30,
    marginLeft: 150,
    marginTop: 300,
  },
  button: {
    // marginTop: 300,
  },
  container: {
    flex: 1,
    marginHorizontal: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    marginTop: 45,
    fontSize: 45,
  },
});
