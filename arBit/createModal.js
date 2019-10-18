// DisplayModal.js

import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

export default class CreateModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.createModal}
        animationType="slide"
        onRequestClose={() => console.log('closed')}>
        <View>
          <Text style={styles.text}>{this.props.data}</Text>
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
