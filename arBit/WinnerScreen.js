import React, {Component} from 'react';
import {db} from './db';

import {Text, Container} from 'native-base';
import {Modal, StyleSheet, Button} from 'react-native';

export default class WinnerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exited: 0,
    };
  }

  componentDidUpdate() {
    const {navigation} = this.props;
    db.child('Events/' + navigation.getParam('roomName', 'NO-ROOM')).on(
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
  }

  clickedExit() {
    const {navigation} = this.props;
    const {navigate} = this.props.navigation;
    
    db.child('Events/' +  navigation.getParam('roomName', 'NO-ROOM')).remove();
    navigate('Home');
  }

  render() {
    const {navigation} = this.props;
    return (
      <Modal>
        <Container style={styles.container}>
          <Text>And the Winner is {navigation.getParam('winner', 'NO-WINNER')}</Text>
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
