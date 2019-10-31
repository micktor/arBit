import React, { Component } from "react";
import { Form, Container, Item, ListItem, Input, Header, Button, Content, Toast, Text, Left, Body, Right, Title, Label, Spinner } from "native-base";
import { StyleSheet, Modal, View, FlatList, SafeAreaView } from "react-native";
var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

import AddPersonModal from './addPersonModal'


export default class OptionsModal extends Component {


  constructor(props) {
    super(props);
    this.state = {
      optionList: ["Candy","Tom", "YANKA", "Luna"],
      option: ''
    };
  }

  addOption = () =>{
      console.log(this.state.option)
      this.setState(prevState => ({optionList: prevState.optionList.concat([this.state.option])}))
  }

  handleOption = text => {
    this.setState({option: text});
  };

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
                onChangeText = {this.handleOption}
              />
              <Button onPress = {this.addOption}>
                <Text>Submit</Text>
              </Button>
            </Item>
          </Form>
      <SafeAreaView>
        <FlatList
          data = {this.state.optionList}
          keyExtractor={(item,index) => index.toString()}
        renderItem = {({item}) => <Text style={styles.list}>{item}</Text>}
        /> 
      </SafeAreaView>



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
  list:{
    padding:15,
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