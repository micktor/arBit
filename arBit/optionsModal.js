import React, { Component } from "react";
import { Form, Container, Item, Input, Header, Button, Content, Toast, Text, Left, Body, Right, Title, Label, Spinner } from "native-base";
import { StyleSheet, Modal, View } from "react-native";
var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

import AddPersonModal from './addPersonModal'

export default class OptionsModal extends Component {


  constructor(props) {
    super(props);
    this.state = {
      optionList: [],
      option: ''
    };
  }

  addOption = () =>{
      console.log()

  }


  render() {
    return (
      <Modal visible={this.props.displayOptions} animationType="slide">
        <Header span>
          <Body>
            <Title style={styles.title}>{this.props.personName},   Welcome to {this.props.roomName}</Title>
          </Body>
        </Header>

        <Container style={styles.container}>
          <Form>
            <Item>
              <Input
                placeholder="Enter your option"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText = {this.state.option}
              />
              <Button>
                <Text>Submit</Text>
              </Button>
            </Item>
          </Form>
          {/* <Button full rounded danger style={styles.button}>
            <Text>Go Back to Home</Text>
          </Button> */}
        </Container>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },

  bigBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
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
  title: {
    justifyContent: 'center',
  },

  button: {
    marginTop: 50
  }
});