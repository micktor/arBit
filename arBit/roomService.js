import {db} from './db';

export const addRoom = room => {
  db.add({
    name: room,
  });
};