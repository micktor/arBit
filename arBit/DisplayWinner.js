import React, {Component} from 'react';
import {db} from './db';

import {
    Text,
    Container
  } from 'native-base';
import { Modal , StyleSheet} from 'react-native';


export default class App extends Component {


render()   {
    return(
        <Modal>
        <Container style={styles.container}>
        <Text>And the Winner is .....</Text>
        </Container>
        </Modal>
    )
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
      justifyContent: "center",
    },
  });