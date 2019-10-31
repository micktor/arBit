import React, {Component} from 'react';
import {
  Form,
  Container,
  Item,
  Input,
  Header,
  Button,
  Content,
  Toast,
  Text,
  Left,
  Body,
  Right,
  Title,
  Label,
  Spinner,
} from 'native-base';
import {StyleSheet, Modal, View, SafeAreaView, FlatList} from 'react-native';
import AddPersonModal from './addPersonModal';
import {db} from './db';

export default class OptionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionList: [],
      option: '',
    };
  }

  handleOption = text => {
    this.setState({option: text});
  };

  addOption = () => {
    if (this.state.option == '') alert('Invalid Input');
    else {
      db.child('Events/' + this.props.roomName + '/optionList/optionList')
        .push({
          option: this.state.option,
          votes: 0,
        })
        .then(() => {
          console.log('INSERTED OPTIONLIST!');
          console.log(this.state);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <Modal visible={this.props.displayOptions} animationType="slide">
        <Header span>
          <Body>
            <Title style={styles.title}>
              {this.props.personName}, Welcome to {this.props.roomName}
            </Title>
          </Body>
        </Header>

        <Container style={styles.container}>
          <Form>
            <Item>
              <Input
                placeholder="Enter your option"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleOption}
              />
              <Button onPress={() => this.addOption()}>
                <Text>Submit</Text>
              </Button>
            </Item>
          </Form>
          <SafeAreaView>
            <FlatList
              data={this.state.optionList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => <Text style={styles.list}>{item}</Text>}
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

  button: {
    marginTop: 50,
  },
});
