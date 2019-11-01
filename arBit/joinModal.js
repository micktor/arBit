// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import AddPersonModal from './addPersonModal';
import {db} from './db';
import {
  Container,
  Content,
  Header,
  Form,
  Title,
  Input,
  Item,
  Button,
  Label,
  List,
  ListItem,
} from 'native-base';

export default class JoinModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      displayName: false,
      roomList: [],
      userList: [],
    };
  }

  componentDidMount() {
    console.log('COMPONENT DID MOUNT GOT CALLED');
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
    if (this.state.roomName != '') {
      this.setState({...this.state, displayName: !this.state.displayName});
    } else alert('Please Enter Room Name');
  };
  toggleJoinModal = () => {
    var found = this.state.roomList.includes(this.state.roomName);

    if (!found) {
      alert('Room has not been created yet!');
    } else {
      this.setState({...this.state, displayName: !this.state.displayName});
    }
  };

  handleRoomName = text => {
    this.setState({roomName: text});
  };

  render() {
    return (
      <Modal
        visible={this.props.displayJoin}
        animationType="slide"
        onRequestClose={() => console.log('closed')}>
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
            <AddPersonModal
              displayName={this.state.displayName}
              toggleNameModal={this.toggleNameModal}
              roomName={this.state.roomName}
            />
            <Button
              style={createModalStyle.button}
              onPress={() => this.props.toggleJoinModal()}
              full
              rounded
              danger>
              <Text>Close</Text>
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
