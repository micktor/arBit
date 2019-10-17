import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  Button
} from 'react-native-elements';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDHMs6x7NbFFZh0l1h4wXOolei9dqmqxEs",
  authDomain: "arbit-a3d71.firebaseapp.com",
  databaseURL: "https://arbit-a3d71.firebaseio.com",
  projectId: "arbit-a3d71",
  storageBucket: "arbit-a3d71.appspot.com",
  messagingSenderId: "525569159710",
  appId: "1:525569159710:web:875f439e842961832a740f",
  measurementId: "G-202R2PZ94C"
};

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
 }


function Separator() {
  return <View style={styles.separator} />;
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>

      <View>
        <Text style={styles.title}>
          arBit
        </Text>
      </View>

      <View>
        <Button
          title="Create Event"
          onPress={() => Alert.alert('Event Button pressed')}
        />
      </View>

      <Separator />
      <View>
        <Button
          title="Join Event"
          onPress={() => Alert.alert('Join Event pressed')}
        />
      </View>
      <Separator />
  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    marginTop: 45,
    fontSize: 45,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
