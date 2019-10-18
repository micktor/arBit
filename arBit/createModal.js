// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-elements';

export default class CreateModal extends Component {
  state = {
    roomName: '',
  };

  constructor(props) {
    super(props);
  }

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  CheckRoomName() {
    if (this.state.roomName != '') {
      alert('Success');
      console.log(this.state.roomName);
    } else alert('Please Enter Room Name');
  }

  render() {
    return (
      <Modal
        visible={this.props.displayCreate}
        animationType="slide"
        onRequestClose={() => console.log('closed')}>
        <View>
          <TextInput placeholder="Name" onChangeText={this.handleRoomName} />
          <Button title="Enter" onPress={() => this.CheckRoomName()} />
          <Button
            style={styles.button}
            title="Close"
            onPress={() => this.props.toggleCreateModal()}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginLeft: 180,
    marginTop: 300,
  },
  button: {
    marginTop: 300,
  },
});
