import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, FlatList, SafeAreaView, Modal} from 'react-native';


import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem } from 'native-base'

import OptionsModal from './optionsModal';



export default class AddPersonModal extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      PersonName: '',
      roomName: '',
      displayOptions: false,
    };
  }

  handlePersonName = text => {
    this.setState({PersonName:text})
  }


  toggleOptionsModal() {
    if(this.state.PersonName != ''){
      this.setState({...this.state, displayOptions: !this.state.displayOptions});
      this.setState({roomName:this.props.roomName})

      // console.log("name: ", this.state.name);
      // console.log("option: ", this.state.option);
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

            <Button onPress={() => this.toggleOptionsModal()} style={styles.button} full rounded success>
              <Text>Submit</Text>
            </Button>
            <OptionsModal
              displayOptions={this.state.displayOptions}
              toggleOptionsModal={this.toggleOptionsModal}
              roomName= {this.state.roomName}
            />

            <Button
              style={styles.button}
              title="Cancel"
              onPress={() => this.props.toggleNameModal()} style={styles.button} full rounded danger>
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
    marginTop: 50
  }
});