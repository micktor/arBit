import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Modal,
} from 'react-native';

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

import {db} from './db';
import OptionsModal from './optionsModal';
export default class AddPersonModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      roomName: '',
      users: new Set(),
      displayOptions: false,
    };
  }

  handleUserName = text => {
    this.setState({userName: text});
  };

  toggleOptionsModal() {
    if (this.state.userName != '') {
      this.setState({
        ...this.state,
        displayOptions: !this.state.displayOptions,
      });
      this.setState({roomName: this.props.roomName});
    } else {
      alert('Please enter some stuff!');
    }
  }

  setUserList() {
    let currentState = this.state.users;
    db.child('Events/' + this.props.roomName).once('value', snapshot => {
      snapshot.forEach(data => {
        const currentUser = data.val();
        currentState.add(currentUser.userName);
      });
      this.setState({
        users: currentState,
      });
    });
  }

  insertUser() {
    this.setUserList();

    if (this.state.users.has(this.state.userName)) {
      alert('Username already taken!');
      return -1;
    } else {
      db.child('Events/' + this.props.roomName)
        .push({
          userName: this.state.userName,
          options: ['option1'],
          url: '',
          hasVoted: false,
          votes: 0,
        })
        .then(() => {
          // console.log('INSERTED!');
          // console.log(this.state);
        })
        .catch(error => {
          // console.log(error);
        });
      var ref = db.child('Events/' + this.props.roomName+'/roominfo/users')
     ref.transaction(function(users){
     if(users || (users === 0 )){
            users = users +1
        }
        return users
      });
      }
    }

  render() {
    return (
      <Modal
        visible={this.props.displayName}
        animationType="slide"
        onRequestClose={() => console.log('closed')}>
        <Container style={styles.container}>
          <View>
            <Text style={styles.bigBlack}>Hello There</Text>
          </View>
          <Form>
            <Item>
              <Label>Enter a Username</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleUserName}
              />
            </Item>

            <Button
              onPress={() => {
                if (this.insertUser() != -1) this.toggleOptionsModal();
              }}
              style={styles.button}
              full
              rounded
              success>
              <Text>Submit</Text>
            </Button>
            <OptionsModal
              displayOptions={this.state.displayOptions}
              toggleOptionsModal={this.toggleOptionsModal}
              roomName={this.state.roomName}
              userName={this.state.userName}
            />
            <Button
              style={styles.button}
              title="Cancel"
              onPress={() => this.props.toggleNameModal()}
              style={styles.button}
              full
              rounded
              danger>
              <Text>Cancel</Text>
            </Button>
          </Form>
        </Container>
      </Modal>
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

  bigBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 50,
  },

  smallBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 25,
  },

  button: {
    marginTop: 50,
  },
});
