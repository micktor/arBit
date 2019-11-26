import React, {Component} from 'react';
import {
  ListItem,
  Form,
  Container,
  Item,
  Input,
  Button,
  Text,
  Left,
  Right,
} from 'native-base';
import {StyleSheet, FlatList, Image, Linking} from 'react-native';
import {db} from './db';
import {Dropdown} from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');

export default class OptionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iamlast: false,
      haveIvoted: false,
      optionList: [],
      optionListUrl: [],
      optionListImage: [],
      option: '',
      formShow: true,
      submitted: 0,
      voted: false,
      users: 0,
      myList: [],
      myListKeys: [],
      voteButton: false,
      userSetKeys: new Set(),
      optionKeys: new Set(),
      pickers: [],
      voteValueList: [],
      buttonDisabled: false,
      doneVote: false,
      winner: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    Geolocation.getCurrentPosition(info => this.setState({location: info}));

    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/roominfo',
    ).on('child_changed', snapshot => {
      const data = snapshot.val();
      const key = snapshot.key;
      console.log(key, data);
      key.toString();
      if (key === 'submitted' && data == this.state.users) {
        this.pushUserOptionstoUsers();
        this.setState({...this.state, voteButton: true});
      } else if (
        key === 'numbervoted' &&
        data === this.state.users - 1 &&
        !this.state.haveIvoted
      ) {
        this.setState({iamlast: true});
      } else if (key === 'winner') {
        this.setState({winner: data});
      } else if (key == 'numbervoted' && data === this.state.users) {
        this.setState({doneVote: true});
      }
    });

    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/optionList',
    ).on('child_added', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.setState(prevState => ({
          optionList: [data.option, ...prevState.optionList],
          optionListUrl: [data.url, ...prevState.optionListUrl],
          optionListImage: [data.image_url, ...prevState.optionListImage],
        }));
      }
    });

    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/optionList',
    ).on('child_removed', snapshot => {
      const data = snapshot.val();
      console.log("Data '" + data.option + "' has been deleted");
      if (data) {
        console.log(data);
        var idx = this.state.optionList.indexOf(data.option);
        let yourArray = [...this.state.optionList];
        if (data.option == this.state.optionList[idx]) {
          yourArray.splice(idx, 1);
          console.log(yourArray);
          this.setState({optionList: yourArray});
          console.log(this.state.optionList);
        }
      }
    });

    // gets user keys
    db.child('Events/' + navigation.getParam('roomName')).once(
      'value',
      snapshot => {
        snapshot.forEach(data => {
          const currentKey = data.key;
          if (
            currentKey != 'optionList' &&
            currentKey != 'roominfo' &&
            currentKey != navigation.getParam('roomName')
          ) {
            this.state.userSetKeys.add(currentKey);
          }
        });
      },
    );

    // Obtains keys for options under optionList
    db.child('Events/' + navigation.getParam('roomName') + '/optionList/').once(
      'value',
      snapshot => {
        snapshot.forEach(data => {
          const currentKey = data.key;
          this.state.optionKeys.add(currentKey);
          console.log("CURRENTLEY"+data.url)
        });
      },
    );
  }

  pullVotes() {
    const {navigation} = this.props;
    const optionVote = {};
    for (
      var it = this.state.userSetKeys.values(), val = null;
      (val = it.next().value);

    ) {
      for (i = 0; i < this.state.optionList.length; i++) {
        var option = this.state.optionList[i];
        db.child(
          'Events/' +
            navigation.getParam('roomName', 'NO-ROOM') +
            `/${val}/options/${option}`,
        ).once('value', function(snapshot) {
          if (optionVote[option] == null) {
            optionVote[option] = snapshot.val();
          } else {
            optionVote[option] = optionVote[option] + snapshot.val();
          }
        });
      }
    }

    console.log('Pickers=', this.state.pickers);
    console.log('Optionvote=', optionVote);
    var option = this.state.optionList[0];
    var max = optionVote[option];
    var win = option;

    // Testing only: prints out options and votes for each (can be deleted, only for testing)
    for (i = 0; i < this.state.optionList.length; i++) {
      var option = this.state.optionList[i];
      if (optionVote[option] > max) {
        max = optionVote[option];
        win = option;
      }
    }
    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/roominfo',
    ).update({
      winner: win,
    });
  }

  submitButton = () => {
    let buttonStyle = this.state.formShow
      ? {backgroundColor: 'orange'}
      : {backgroundColor: 'teal'};
    let text = this.state.formShow
      ? 'Done with options'
      : 'Waiting for others to finish';

    return (
      <Button
        disabled={!this.state.formShow}
        style={Object.assign({}, buttonStyle, styles.bottomButton)}
        onPress={() => this.showform()}>
        <Text>{text}</Text>
      </Button>
    );
  };

  pushVotes() {
    const {navigation} = this.props;
    console.log('userKey: ' + navigation.getParam('userKey'));
    if (this.areValidVotes()) {
      this.setState({buttonDisabled: true});
      var ref = db.child(
        'Events/' +
          navigation.getParam('roomName', 'NO-ROOM') +
          '/roominfo/numbervoted',
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
            'Events/' +
              navigation.getParam('roomName', 'NO-ROOM') +
              '/' +
              `/${navigation.getParam('userKey', 'NO-ROOM')}/options`,
          ).update({
            [option]: this.state.pickers[i],
          });
        }
      }
      this.setState({voted: true});
      this.setState({haveIvoted: true});
      if (this.state.iamlast) {
        this.pullVotes();
        this.setState({doneVote: true});
      }
    } else {
      alert('Every option must be voted for with a unique number');
    }
  }

  areValidVotes() {
    if (this.state.pickers.includes(0)) {
      return false;
    }
    for (i = 0; i < this.state.optionList.length; i++) {
      var voteValue = this.state.pickers[i];
      if (voteValue == 0) {
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

  exitButton = () => {
    if (!this.state.doneVote) {
      return (
        <Button
          style={styles.exitBottomButton}
          disabled={this.state.buttonDisabled}
          onPress={() => this.props.navigation.navigate('Home') && this.deleteUser()}> 
          <Text>Exit</Text>
        </Button>
      );
    }
  };


  deleteUser = () => {
    const {navigation} = this.props;
    // delete user
    db.child('Events/' + navigation.getParam('roomName', 'NO-ROOM') +
        `/${navigation.getParam('userKey', 'NO-ROOM')}`,
    ).remove();
    
    // update users & submitted count in roominfo 
    var user_count = this.state.users - 1;
    var submit_count = this.state.submitted - 1;
    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/roominfo',)
      .update({
          users: user_count,
          submitted: submit_count,
    });

    console.log("userSetKeys before delete: ", this.state.userSetKeys)  
    this.state.userSetKeys.delete(navigation.getParam('userKey', 'NO-ROOM'));
    console.log("userSetKeys after delete: ", this.state.userSetKeys)  

    // delete room if users = 0
    var user_count = db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/roominfo/users',);
    user_count.transaction(function(users){
      if(users == 0){
        db.child('Events/' + navigation.getParam('roomName', 'NO-ROOM'),
        ).remove();
      }
    })
  };


  determine(item) {
    if (this.state.myList.includes(item)) {
      return true;
    } else {
      return false;
    }
  }

  deleteOption = item => {
    const {navigation} = this.props;
    // return item
    var index = this.state.myList.indexOf(item);

    var key = this.state.myListKeys[index];

    db.child(
      'Events/' +
        navigation.getParam('roomName', 'NO-ROOM') +
        '/optionList/' +
        key,
    ).remove();

    delete this.state.myList[index];
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
              {this.determine(item) ? (
                <Icon.Button
                  name="trash"
                  backgroundColor="#3b5998"
                  onPress={() => this.deleteOption(item)}></Icon.Button>
              ) : (
                <Icon.Button
                  disabled={true}
                  backgroundColor="#ffffff"></Icon.Button>
              )}
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
    console.log(this.state.optionListUrl);
    let data = [];
    for (var i = 0; i < this.state.optionList.length; i++) {
      data.push({value: i + 1});
    }

    var yelp_images = {};
    this.state.optionList.forEach((key, i) => yelp_images[key] = this.state.optionListImage[i]);
    console.log("IMAGES: "+JSON.stringify(yelp_images));

    var yelp_urls = {};
    this.state.optionList.forEach((key, i) => yelp_urls[key] = this.state.optionListUrl[i]);
    console.log("URL: "+JSON.stringify(yelp_urls));

    return (
      <Container style={styles.container}>
        <FlatList
          data={this.state.optionList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <ListItem selected onPress={ ()=> Linking.openURL(yelp_urls[item])}>
              <Left>
                <Image source={{uri: yelp_images[item]}}
                style={{width: 100, height: 100}} />
              <Text style={{marginLeft: 10}}>{item}</Text>
              </Left>
              <Dropdown
                containerStyle={styles.dropdown}
                disabled={this.state.voted}
                data={data}
                onChangeText={value => {
                  this.handleDropDownSelection(index, value);
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
    const {navigation} = this.props;
    let b = new Set(navigation.getParam('roomList', 'NO-ROOM'));
    let difference = new Set(
      [...this.state.userSetKeys].filter(x => !b.has(x)),
    );
    this.state.userSetKeys = difference;
  }

  pushUserOptionstoUsers() {
    const {navigation} = this.props;
    this.removeRoomNamesFromUserSet();
    for (
      var it = this.state.userSetKeys.values(), val = null;
      (val = it.next().value);

    ) {
      for (i = 0; i < this.state.optionList.length; i++) {
        var option = this.state.optionList[i];
        db.child(
          'Events/' +
            navigation.getParam('roomName', 'NO-ROOM') +
            `/${val}/options`,
        ).update({
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
    const {navigation} = this.props;
    this.setState({formShow: !this.state.formShow});
    var ref = db.child(
      'Events/' +
        navigation.getParam('roomName', 'NO-ROOM') +
        '/roominfo/submitted',
    );
    action = this.state.formShow;
    ref.transaction(function(submitted) {
      if (submitted || submitted === 0) {
        submitted = action ? submitted + 1 : submitted - 1;
      }
      return submitted;
    });
    db.child(
      'Events/' + navigation.getParam('roomName', 'NO-ROOM') + '/roominfo',
    ).on('child_added', snapshot => {
      var key = snapshot.key;
      var val = snapshot.val();
      this.setState({[key]: val}, function() {
        if (
          this.state.submitted != 0 &&
          this.state.submitted == this.state.users
        ) {
          this.pushUserOptionstoUsers();
          this.setState({...this.state, voteButton: true});
        }
      });
    });
  };

  handleOption = text => {
    // const nameCapitalized = text.charAt(0).toUpperCase() + text.slice(1)
    this.setState({option: text});
  };

  addOption = () => {
    const {navigation} = this.props;
    this.state.option =
      this.state.option.charAt(0).toUpperCase() +
      this.state.option.slice(1).toLowerCase();
    if (this.state.option.match(/^\s+$/) != null || this.state.option == '')
      alert('Invalid Input');
    else if (this.state.optionList.includes(this.state.option)) {
      alert('Duplicate option.....');
    } else {
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
          console.log('Total Yelp results: ' + responseJson.total);
          db.child(
            'Events/' +
              navigation.getParam('roomName', 'NO-ROOM') +
              '/optionList',
          )
            .push({
              option: this.state.option,
              author: navigation.getParam('userName', 'NO-ROOM'),
              url:
                responseJson.total == 0 ? '' : responseJson.businesses[0].url,
              image_url:
                responseJson.total == 0
                  ? 'https://s3-media3.fl.yelpcdn.com/assets/srv0/yelp_styleguide/fe8c0c8725d3/assets/img/default_avatars/business_90_square.png'
                  : responseJson.businesses[0].image_url,
              votes: 0,
            })
            .then(snap => {
              this.setState(prevState => ({
                myListKeys: [snap.key, ...prevState.myListKeys],
              }));
              // console.log(this.state);
            })
            .catch(error => {
              //console.log(error);
            });
          this.setState(prevState => ({
            myList: [this.state.option, ...prevState.myList],
          }));
          console.log(this.state.myListKeys);
          this.setState({option: ''}, function() {});
        })
        .catch(error => {
          console.error(error);
        });
      // console.log(this.state.location.coords.latitude);
      // console.log(this.state.location.coords.longitude);
    }
  };

  static navigationOptions = ({navigation}) => ({
    title:
      navigation.state.params.userName +
      ' welcome to ' +
      navigation.state.params.roomName,
    headerLeft: null,
  });

  render() {
    const {navigate} = this.props.navigation;
    const {navigation} = this.props;
    return (
      <Container style={styles.container}>
        {!this.state.doneVote ? (
          <Container style={styles.container}>
            {!this.state.formShow && !this.state.voteButton ? (
              <Text style={styles.textWrapper}>
                Waiting for {this.state.users - this.state.submitted} members to
                finish...
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

            {!this.state.voteButton 
              ? null
              : this.exitButton()}

          </Container>
        ) : (
          navigate('Winner', {
            users: this.state.users,
            roomName: navigation.getParam('roomName', 'NO-ROOM'),
            winner: this.state.winner,
          })
        )}

        {!this.state.voteButton ? this.submitButton() : this.voteButton()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
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

  exitBottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: '7.5%',
    fontSize: 30,
    marginBottom: -150,
    width: '40%',
    color: 'red',
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
