import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, FlatList, SafeAreaView, Modal} from 'react-native';


import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem } from 'native-base'



export default class AddPersonModal extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      name: '',
      option: '',
    };
  }

  handlePersonName = text => {
    this.setState({name:text})
  }

  handleOption = text => {
    this.setState({option: text})
  }

  checkInputs() {
    if(this.state.name != '' && this.state.option != ''){
      console.log("name: ", this.state.name);
      console.log("option: ", this.state.option);
    } else {
      alert('Please enter some stuff!')
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
              <Label>Name</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handlePersonName}
              />
            </Item>

            <Item>
              <Label>What you wanna eat? </Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleOption}
              />
            </Item>
            <Button onPress={() => this.checkInputs()} style = {styles.button} full rounded success>
              <Text>Submit</Text>
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
    marginTop: 50
  }
});
