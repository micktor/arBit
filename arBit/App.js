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

import CreateModal from './createModal'

function Separator() {
  return <View style={styles.separator} />;
}

export default class App extends Component {
  state = {
    displayCreate: false,
  };

  toggleCreateModal = () => {
    this.setState({...this.state, displayCreate: !this.state.displayCreate });
  };

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
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>arBit</Text>
        </View>

        <View>
          <Button
            title="Create Event"
            onPress={() => this.toggleCreateModal()}
          />
          <CreateModal
            data="test"
            displayCreate={this.state.displayCreate}
            toggleCreateModal = {this.toggleCreateModal}
          />
        </View>
        <Separator />
        
        <View>
          <Button
            title="Join Event"
            onPress={() => Alert.alert('Join Event pressed')}
          />
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
});
