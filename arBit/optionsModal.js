import React, {Component} from 'react';

import {
  List,
  ListItem,
  Form,
  Container,
  Item,
  Icon,
  Input,
  Header,
  Button,
  Content,
  Toast,
  Text,
  Left,
  Center,
  Body,
  Right,
  Title,
  Label,
  Spinner,
  Picker,
  TouchableHighlight,
} from 'native-base';
import {
  StyleSheet,
  Modal,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import AddPersonModal from './addPersonModal';
import {db} from './db';
import DisplayWinner from './DisplayWinner';
import {Dropdown} from 'react-native-material-dropdown';
import Geolocation from '@react-native-community/geolocation';
import { throwStatement } from '@babel/types';
navigator.geolocation = require('@react-native-community/geolocation');

export default class OptionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iamlast:false,
      haveIvoted:false,
      optionList: [],
      option: '',
      formShow: true,
      submitted: 0,
      voted: false,
      users: 0,
      voteButton: false,
      userSetKeys: new Set(),
      optionKeys: new Set(),
      pickers: [],
      voteValueList: [],
      buttonDisabled: false,
      doneVote: false,
      winner: ''
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.roomName != prevProps.roomName) {
      Geolocation.getCurrentPosition(info => this.setState({location: info}));


      db.child('Events/' + this.props.roomName + '/roominfo').on(
        'child_changed',
        snapshot => {
          const data = snapshot.val();
          const key = snapshot.key;
          console.log(key, data)
          key.toString();
          if (key === 'submitted' && data == this.state.users) {
            this.pushUserOptionstoUsers();
            this.setState({...this.state, voteButton: true});
          } else if (key === 'numbervoted' && data === this.state.users - 1 && !this.state.haveIvoted) {
            this.setState({iamlast:true})}
            else if(key === 'winner'){
              this.setState({winner:data})

            }
          
        },
      );

      db.child('Events/' + this.props.roomName + '/optionList').on(
        'child_added',
        snapshot => {
          const data = snapshot.val();
          if (data) {
            this.setState(prevState => ({
              optionList: [data.option, ...prevState.optionList],
            }));
          }
        },
      );
    }

    // gets user keys
    db.child('Events/' + this.props.roomName).once('value', snapshot => {
      snapshot.forEach(data => {
        const currentKey = data.key;
        if (
          currentKey != 'optionList' &&
          currentKey != 'roominfo' &&
          currentKey != this.props.roomName
        ) {
          this.state.userSetKeys.add(currentKey);
        }
      });
    });

      // Obtains keys for options under optionList
      db.child('Events/' + this.props.roomName + '/optionList/').once('value', snapshot => {
        snapshot.forEach(data => {
          const currentKey = data.key;
          // console.log(" data.key: ", data.key)
          this.state.optionKeys.add(currentKey); 
          // console.log("Option = ",currentKey)
        });
      });
  };

  // pulls votes for each option and uses optionVote to map "option key" to it's vote value
  pullVotes(){
    let b = new Set(this.props.userKey);
    let difference = new Set(
      [...this.state.userSetKeys].filter(x => !b.has(x)),
    );
    this.state.userSetKeys = difference;


    const optionVote = {};
    for (var it = this.state.userSetKeys.values(), val= null; val=it.next().value; ) {
      for (i = 0; i < this.state.optionList.length; i++) {
        var option = this.state.optionList[i];
        db.child('Events/' + this.props.roomName + `/${val}/options/${option}`)
        .once('value', function(snapshot) {
          if(optionVote[option] == null){
            optionVote[option] = snapshot.val()
          }
          else{
            optionVote[option] = optionVote[option] + snapshot.val()
         
          }
        })
      }
    }

    var array = this.state.optionList
    
    var sum =  this.state.pickers.map(function (num, idx) {
      option = array[idx]
      return num + optionVote[option];
    });

    var option = this.state.optionList[0]
    var max = sum[0]
    var win = option

    // Testing only: prints out options and votes for each (can be deleted, only for testing)
    for (i = 0; i < this.state.optionList.length; i++) {
      var option = this.state.optionList[i];
      if(sum[i] > max){
        max = optionVote[option]
        win = option
      }
    }
    db.child('Events/'+this.props.roomName+'/roominfo')
     .update({
       winner: win
     })
  }
  

  submitButton = () => {
    // just for testing pullVotes 
    

    let buttonStyle = this.state.formShow
      ? {backgroundColor: 'orange'}
      : {backgroundColor: 'teal'};
    let text = this.state.formShow
      ? 'Done with options'
      : 'Click to enter more options';

    return (
      <Button
        style={Object.assign({}, buttonStyle, styles.bottomButton)}
        onPress={() => this.showform()}>
        <Text>{text}</Text>
      </Button>
    );
  };


  pushVotes() {
    if (this.areValidVotes()) {
      this.setState({buttonDisabled: true});
      var ref = db.child(
        'Events/' + this.props.roomName + '/roominfo/numbervoted',
      );
      ref.transaction(function(numbervoted) {
        if (numbervoted || numbervoted === 0) {
          numbervoted = numbervoted + 1;
        }
        return numbervoted;
      });
      {
        for (i = 0; i < this.state.optionList.length; i++) {
          var option = this.state.optionList[i];
          db.child(
            'Events/' + this.props.roomName + `/${this.props.userKey}/options`,
          ).update({
            [option]: this.state.pickers[i],
          });
        }
      }
      this.setState({voted: true});
      this.setState({haveIvoted:true})
    if(this.state.iamlast){
        this.pullVotes();
        this.setState({doneVote: true});}
    } else {
      alert('Every option must be voted for with a unique number');
    }
  }

  areValidVotes() {
    if(this.state.pickers.includes(0)){
      return false
    }
    for(i = 0; i < this.state.optionList.length; i++){
      var voteValue = this.state.pickers[i]
      if(voteValue == 0){
        return false;
      }
    }
    return this.state.pickers.length === new Set(this.state.pickers).size;
  }

  voteButton = () => {
    if (!this.state.doneVote) {
      return (
        <Button
          style={styles.bottomButton}
          disabled={this.state.buttonDisabled}
          onPress={() => this.pushVotes()}>
          <Text>Vote</Text>
        </Button>
      );
    }
  };

  showOptionsWithoutVote = item => {
    return (
      <Container style={styles.container}>
        <FlatList
          data={this.state.optionList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem selected>
              <Left>
                <Text>{item}</Text>
              </Left>
              <Text></Text>
            </ListItem>
          )}
        />
      </Container>
    );
  };

  handleDropDownSelection(index, vote) {
    let markers = [...this.state.pickers];
    markers[index] = vote;
    this.setState({pickers: markers});
    console.log(this.state.pickers);
  }

  showOptionsWithVote = item => {
    let data = [];
    for (var i = 0; i < this.state.optionList.length; i++) {
      data.push({value: i + 1});
    }
    return (
      <Container style={styles.container}>
        <FlatList
          data={this.state.optionList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <ListItem selected>
              <Left>
                <Text>{item}</Text>
              </Left>
              <Text></Text>
              <Dropdown
              containerStyle={styles.dropdown}
              disabled = {this.state.voted}
              data={data}
               
               onChangeText={(value)=> {
                this.handleDropDownSelection(index,value)
             }}
               
                />
              <Right>
                <Button danger rounded></Button>
              </Right>
            </ListItem>
          )}
        />
      </Container>
    );
  };

  removeRoomNamesFromUserSet() {
    let b = new Set(this.props.roomList);
    let difference = new Set(
      [...this.state.userSetKeys].filter(x => !b.has(x)),
    );
    this.state.userSetKeys = difference;
  }

  pushUserOptionstoUsers() {
    this.removeRoomNamesFromUserSet();
    for (
      var it = this.state.userSetKeys.values(), val = null;
      (val = it.next().value);

    ) {
      for (i = 0; i < this.state.optionList.length; i++) {
        var option = this.state.optionList[i];
        db.child('Events/' + this.props.roomName + `/${val}/options`).update({
          [option]: 0,
        });
        if (!this.state.voteValueList.includes((i + 1).toString())) {
          this.state.voteValueList.push(i + 1 + '');
          this.state.pickers.push(0);
        }
      }
    }
  }

  showform = () => {
    this.setState({formShow: !this.state.formShow});
    var ref = db.child('Events/' + this.props.roomName + '/roominfo/submitted');
    action = this.state.formShow;
    ref.transaction(function(submitted) {
      if (submitted || submitted === 0) {
        submitted = action ? submitted + 1 : submitted - 1;
      }
      return submitted;
    });
    db.child('Events/' + this.props.roomName + '/roominfo').on(
      'child_added',
      snapshot => {
        var key = snapshot.key;
        var val = snapshot.val();
        //console.log("KEY = ",key ,"Value = ", val)
        this.setState({[key]: val}, function() {
          //console.log("AFTER setting state = ",this.state)
          if (
            this.state.submitted != 0 &&
            this.state.submitted == this.state.users
          ) {
            this.pushUserOptionstoUsers();
            //console.log('WE ARE SETTING STATE')
            this.setState({...this.state, voteButton: true});
          }
        });
      },
    );
  };

  handleOption = text => {
    this.setState({option: text});
  };

  checkLenOfList = () => {
    console.log('vote button is pressed');
    console.log(this.state.optionList.length);
  };

  addOption = () => {
    if (this.state.option == '') alert('Invalid Input');
    else {
      fetch(
        'https://api.yelp.com/v3/businesses/search?term=' +
          this.state.option +
          '&latitude=' +
          this.state.location.coords.latitude +
          '&longitude=' +
          this.state.location.coords.longitude,
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer -zeb3KhLhUOIjLrBhRofrU45bDUlqK0Oujw_aIEIkRpBZ_3pd2uZctcumUeg_bo6zr4ygVhLTDdJNepIqSl-LqhuycwAYY3Vxgpm_e7aTZYeIxv7oeGRXgKAx_GcXXYx',
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("Total Yelp results: " + responseJson.total);
          db.child('Events/' + this.props.roomName + '/optionList')
            .push({
              option: this.state.option,
              author: this.props.userName,
              url: responseJson.total == 0 ? '' : responseJson.businesses[0].url,
              image_url: responseJson.total == 0 ? '' : responseJson.businesses[0].image_url,
              votes: 0,
            })
            .then(() => {
              // console.log(this.state);
            })
            .catch(error => {
              //console.log(error);
            });
          this.setState({option: ''}, function() {});
        })
        .catch(error => {
          console.error(error);
        });

      // console.log(this.state.location.coords.latitude);
      // console.log(this.state.location.coords.longitude);
    }
  };

  render() {
    return (
      <Modal visible={this.props.displayOptions} animationType="slide">
        <Header span>
          <Body>
            <Title style={styles.title}>
              {this.props.userName}, Welcome to {this.props.roomName}
            </Title>
          </Body>
        </Header>
        {!this.state.doneVote ? (
          <Container style={styles.container}>
            {!this.state.formShow && !this.state.voteButton ? (
              <Text style={styles.textWrapper}>
                Waiting for other members to finish...
              </Text>
            ) : this.state.formShow && !this.state.voteButton ? (
              <Form>
                <Item>
                  <Input
                    placeholder="Enter your option"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={this.handleOption}
                    value={this.state.option}
                  />
                  <Button onPress={() => this.addOption()}>
                    <Text>Submit</Text>
                  </Button>
                </Item>
              </Form>
            ) : (
              <Text style={styles.textWrapper}>
                Rank you choices, high to low
              </Text>
            )}

            {!this.state.voteButton
              ? this.showOptionsWithoutVote()
              : this.showOptionsWithVote()}
          </Container>
        ) : (
          <DisplayWinner winner = {this.state.winner}/>
        )}

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

  dropdown: {
    width: '20%',
  },

  button: {
    marginTop: 50,
    width: 180,
  },
});
