import React, { Component } from 'react';
import {
  Form,
  Container,
  Item,
  Input,
  Header,
  Button,
  Text,
  Body,
  Title,
} from 'native-base';
import { StyleSheet, Modal, View, SafeAreaView, FlatList } from 'react-native';
import AddPersonModal from './addPersonModal';
import { db } from './db';

export default class OptionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionList: [],
      option: '',
      formShow: true,
      submitted: 0,
      voted: 0,
      users: 0,
      voteButton: false,
      userSetKeys: new Set(),
    }
  }

  componentDidUpdate = (prevProps) => {

    if (this.props.roomName != prevProps.roomName) {
      db
        .child('Events/' + this.props.roomName + '/optionList/optionList')
        .on("child_added", snapshot => {
          const data = snapshot.val()
          if (data) {
            
            this.setState(prevState => ({
              optionList: [data.option, ...prevState.optionList]
            }))
          }
        })
        
    }

    db.child('Events/' + this.props.roomName).once('value', snapshot => {
      snapshot.forEach(data => {
        const currentKey = data.key;
        if(currentKey != "optionList" && currentKey != "roominfo"){
          this.state.userSetKeys.add(currentKey);
        }
      });
    });
  }


  submitButton = () => {
    let buttonStyle = this.state.formShow ? { backgroundColor: 'orange' } : { backgroundColor: 'teal' }
    let text = this.state.formShow ? "Done with options" : "Click to enter more options"


    return (
      <Button style={Object.assign({}, buttonStyle, styles.bottomButton)}
        onPress={() => this.showform()}>
        <Text>{text}</Text>
      </Button>
    )
  }

  voteButton = () => {

    return (
      <Button style={styles.bottomButton}>
        <Text>Vote</Text>
      </Button>
    )

  }

  pushUserOptionstoUsers(){
    for (var it = this.state.userSetKeys.values(), val= null; val=it.next().value; ) {
      db.child('Events/' + this.props.roomName + `/${val}/options`)
        .set({
          options: this.state.optionList.reduce((acc, elem) =>{
            acc[elem]=0
            return acc
          },{})
        });
    }
  }

  showform = () => {
    this.setState({ formShow: !this.state.formShow })
    var ref = db.child('Events/' + this.props.roomName + '/roominfo/submitted')
    action = this.state.formShow
    ref.transaction(function (submitted) {
      if (submitted || (submitted === 0)) {
        submitted = action ? submitted + 1 : submitted - 1
      }
      return submitted
    });
    db
        .child('Events/' + this.props.roomName + '/roominfo')
        .on("child_added", snapshot => {
          var key = snapshot.key
          var val = snapshot.val()
          //console.log("KEY = ",key ,"Value = ", val)
          this.setState({ [key]: val }, function(){
            //console.log("AFTER setting state = ",this.state)
            if (this.state.submitted != 0 && (this.state.submitted == this.state.users)) {
              this.pushUserOptionstoUsers();
              //console.log('WE ARE SETTING STATE')
              this.setState({ ...this.state, voteButton: true })
            }
          })
        })
  }

  handleOption = text => {
    this.setState({ option: text });
  };

  addOption = () => {
    if (this.state.option == '') alert('Invalid Input');
    else {
      db.child('Events/' + this.props.roomName + '/optionList/optionList')
        .push({
          option: this.state.option,
          author: this.props.userName,
          votes: 0,
        })
        .then(() => {
          // console.log(this.state);
        })
        .catch(error => {
          //console.log(error);
        });
    }
    this.setState({option :''})
  };

  render() {
    // console.log(this.state)
    return (
      <Modal visible={this.props.displayOptions} animationType="slide">
        <Header span>
          <Body>
            <Title style={styles.title}>
              {this.props.userName}, Welcome to {this.props.roomName}
            </Title>
          </Body>
        </Header>

        <Container style={styles.container}>
          {(!this.state.formShow && !this.state.voteButton) ?
          <Text style={styles.textWrapper}>Waiting for other members to finish...</Text> :
            (this.state.formShow && !this.state.voteButton) ?
            <Form>
              <Item>
                <Input
                  placeholder="Enter your option"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={this.handleOption}
                  value = {this.state.option}
                />
                <Button onPress={() => this.addOption()}>
                  <Text>Submit</Text>
                </Button>
              </Item>
            </Form> :
            <Text style={styles.textWrapper}>Rank you choices, high to low</Text>}
          <SafeAreaView>
            <FlatList
              data={this.state.optionList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.list}>{item}</Text>}
            />
          </SafeAreaView>
          {/* <Button full rounded danger style={styles.button}>
            <Text>Go Back to Home</Text>
          </Button> */}
        </Container>

        {!this.state.voteButton ? this.submitButton() : this.voteButton()}

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

  textWrapper: {
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  bigBlack: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 50,
  },
  list: {
    padding: 15,
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

  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7.5%',
    fontSize: 30,
    marginBottom: 100,
  },
  show: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7.5%',
    fontSize: 30,
    marginBottom: 100,
  },


  button: {
    marginTop: 50,
  },
});
