import * as firebase from 'firebase';
import 'firebase/firestore';

let config = {
  apiKey: 'AIzaSyAvZMR61AaJG91sN_4eY1iUrajzOY-OOVA',
  authDomain: 'arbit-a7b01.firebaseapp.com',
  databaseURL: 'https://arbit-a7b01.firebaseio.com',
  projectId: 'arbit-a7b01',
  storageBucket: 'arbit-a7b01.appspot.com',
  messagingSenderId: '612531934167',
  appId: '1:612531934167:web:7d7dd02dc536d59e0d3192',
  measurementId: 'G-HS9FWQZLD1',
};

firebase.initializeApp(config);
let app = firebase.firestore().collection('rooms');
export const db = app;
