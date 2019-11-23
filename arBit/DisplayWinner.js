import React, {Component} from 'react';
import {db} from './db';

import {Text, Container} from 'native-base';
import {Modal, StyleSheet, Button} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exited: 0,
    };
  }

  componentDidUpdate() {
    db.child('Events/' + this.props.roomName + '/roominfo').on(
      'child_changed',
      snapshot => {
        const key = snapshot.key;
        const data = snapshot.val();
        key.toString();
        if (key === 'exited') {
          this.setState({exited: data});
        }
      },
    );

    // if (this.state.exited == this.props.users) {
    //   db.child('Events/' + this.props.roomName).remove();
    // }
  }

  clickedExit() {
    var ref = db.child('Events/' + this.props.roomName + '/roominfo/exited');

    var numExited= this.state.exited + 1
    this.setState({exited: numExited})

    if (
      this.state.exited ==
      ref.transaction(function(numExited) {
        numExited += 1;
        return numExited;
      })
    ) {
      db.child('Events/' + this.props.roomName).remove();
    }
  }

  render() {
    return (
      <Modal>
        <Container style={styles.container}>
          <Text>And the Winner is {this.props.winner}</Text>
        </Container>
        <Button onPress={() => this.clickedExit()} title="Exit" />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 5,
  },

  button: {
    marginTop: 50,
    width: 180,
  },

  icon: {
    width: 125,
    height: 125,
    justifyContent: 'center',
  },
});
