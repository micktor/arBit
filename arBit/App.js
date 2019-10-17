import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Button} from 'react-native-elements';

function Separator() {
  return <View style={styles.separator} />;
}

export default class App extends Component {
  state = {
    display: false,
    roomName: '',
  };

  triggerModal() {
    this.setState(prevState => {
      return {
        display: true,
      };
    });
  }

  closeModal = () => {
    this.setState(prevState => {
      return {
        display: false,
      };
    });
  };

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  CheckRoomName() {
    if (this.state.roomName != ''){
      alert('Success');
      console.log(this.state.roomName)
    } 
    else alert('Please Enter Room Name');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>arBit</Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => this.triggerModal()}>
            <Text style={styles.button}>Create Event</Text> 
          </TouchableOpacity>
          <Modal visible={this.state.display} animationType="slide">
            <View>
              <TextInput
                placeholder="Name"
                style={styles.title}
                onChangeText={this.handleRoomName}
              />
              <TouchableOpacity onPress={() => this.CheckRoomName()}>
                <Text style={styles.button}>Enter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.closeModal()}>
                <Text style={styles.button}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        <Separator />
        <View>
        <TouchableOpacity>
            <Text style={styles.button}>Join Event</Text> 
          </TouchableOpacity>
        </View>
        <Separator />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    marginTop: 45,
    fontSize: 45,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    backgroundColor: '#247ba0',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign: 'center',
  },
});
