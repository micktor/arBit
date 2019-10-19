import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, FlatList, SafeAreaView} from 'react-native';
import * as firebase from 'firebase';

// var firebaseConfig = {
//   apiKey: "AIzaSyAQ4LPfjNUM8WCx2Zzv2qj1rQJ9UpRS9g4",
//   authDomain: "arbit-46505.firebaseapp.com",
//   databaseURL: "https://arbit-46505.firebaseio.com",
//   projectId: "arbit-46505",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// };

import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem } from 'native-base'


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];


// firebase.database().ref('/Events/Friday-night/Persons/Yasin').set({

// })



export default class App extends Component {

  constructor(props) {
    super(props);
    this.firebaseConfig = {
      apiKey: "AIzaSyAQ4LPfjNUM8WCx2Zzv2qj1rQJ9UpRS9g4",
      authDomain: "arbit-46505.firebaseapp.com",
      databaseURL: "https://arbit-46505.firebaseio.com",
      projectId: "arbit-46505",
      
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig);
    }
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
