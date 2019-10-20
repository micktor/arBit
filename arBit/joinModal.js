// DisplayModal.js

import React, { Component } from 'react'
import { Modal, View, Text, StyleSheet,ButtonGroup, TouchableHighlightBase } from 'react-native';
import{ Button} from 'react-native-elements';
import {addRoom} from './roomService';
import AddPersonModal from './addPersonModal'
import {db} from './db'

export default class JoinModal extends Component{
  state = {
    roomName: '',
    displayName: false,
    roomList: [],
  };

  componentDidMount(){
      db
      .get()
      .then(snapshot => {
      snapshot.forEach(doc => {
      if (doc && doc.exists) {
        console.log(doc.data())
        this.state.roomList.push(Object.values(doc.data()))
      }
      });
    });
  }
  toggleNameModal = () => {
     if (this.state.roomName != '') {
      addRoom(this.state.roomName);
      this.setState({...this.state, displayName: !this.state.displayName});
    } else alert('Please Enter Room Name');

  }
  toggleJoinModal = () =>{
    if(this.state.roomName == ''){
      alert('Please Pick a room to join'); 
    }
    else{
      this.setState({...this.state, displayName: !this.state.displayName});
    }
  }

    constructor(props){
      super(props);
      
    }


    render(){
     
      return(
        <Modal visible={ this.props.displayJoin } animationType = "slide" 
                 onRequestClose={ () => console.log('closed') }>
            <View style = {styles.button}>
             {this.state.roomList.length  > 0 ? this.state.roomList.map((name) => 
             <Button 
             key ={name}
             title ={name.toString()}
             onPress = {() => (this.state.roomName = name.toString())}>
             {name}
             </Button>) : <Text style = {styles.text}>There are no Events currently active</Text>}
    
              <Button title="Join" onPress={() => this.toggleJoinModal()} />
              <AddPersonModal
               displayName={this.state.displayName}
               toggleNameModal={this.toggleNameModal}
               />
              <Button 
                title = "Close"
                onPress = {() => this.props.toggleJoinModal()}
               />
            </View>
          </Modal> 
      )
    }
}



const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 50,
  },
  button:{
    marginTop:300

  }
})
