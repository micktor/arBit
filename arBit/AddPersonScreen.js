import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Container, Form, Input, Item, Button, Label} from 'native-base';

import {db} from './db';

export default class AddPersonScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      users: new Set(),
      userKey: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userKey !== prevState.userKey) {
      this.goToOptionsScreen();
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Welcome to ' + navigation.state.params.roomName,
    headerLeft: null,
  });

  handleUserName = text => {
    this.setState({userName: text});
  };

  goToOptionsScreen() {
    const {navigate} = this.props.navigation;
    const {navigation} = this.props;

    if (this.state.userName != '') {
      navigate('Options', {
        userKey: this.state.userKey,
        roomName: navigation.getParam('roomName', 'NO-ROOM'),
        userName: this.state.userName,
        roomList: navigation.getParam('roomList', 'NO-ROOM'),
      });
    } else {
      alert('Please enter some stuff!');
    }
  }

  setUserList() {
    const {navigation} = this.props;
    let currentState = this.state.users;
    db.child('Events/' + navigation.getParam('roomName', 'NO-ROOM')).once(
      'value',
      snapshot => {
        snapshot.forEach(data => {
          const currentUser = data.val();
          currentState.add(currentUser.userName);
        });
        this.setState({
          users: currentState,
        });
      },
    );
  }

  insertUser() {
    const {navigation} = this.props;
    this.setUserList();

    if (
      this.state.users.has(this.state.userName) ||
      this.state.userName.match(/^\s+$/) != null || this.state.userName == ''
    ) {
      alert('Username already taken or is invalid!');
      return -1;
    } else {
      db.child('Events/' + navigation.getParam('roomName', 'NO-ROOM'))
        .push({
          userName: this.state.userName,
        })
        .then(snap => {
          this.setState({userKey: snap.key})
        });
      var ref = db.child(
        'Events/' +
          navigation.getParam('roomName', 'NO-ROOM') +
          '/roominfo/users',
      );
      ref.transaction(function(users) {
        if (users || users === 0) {
          users = users + 1;
        }
        return users;
      });
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container style={styles.container}>
        <View>
          <Text style={styles.bigBlack}>Hello There</Text>
        </View>
        <Form>
          <Item>
            <Input
              placeholder="Enter a user name"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={this.handleUserName}
            />
          </Item>

          <Button
            onPress={() => this.insertUser()}
            style={styles.button}
            full
            rounded
            success>
            <Text>Submit</Text>
          </Button>
          <Button
            style={styles.button}
            title="Cancel"
            onPress={() => navigate('Home')}
            style={styles.button}
            full
            rounded
            danger>
            <Text>Cancel</Text>
          </Button>
        </Form>
      </Container>
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
